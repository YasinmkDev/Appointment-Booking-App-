import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const webhookSecret = Deno.env.get('NOTIFICATION_WEBHOOK_SECRET');

if (!supabaseUrl || !serviceRoleKey || !webhookSecret) {
  throw new Error('Missing notification function secrets');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

interface NotificationRequest {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

Deno.serve(async (request) => {
  if (request.method !== 'POST' || request.headers.get('x-webhook-secret') !== webhookSecret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: NotificationRequest;
  try {
    payload = await request.json() as NotificationRequest;
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!payload.userId || !payload.title || !payload.body) {
    return Response.json({ error: 'userId, title, and body are required' }, { status: 400 });
  }

  const { data: tokenRow, error: tokenError } = await supabase
    .from('push_tokens')
    .select('token')
    .eq('user_id', payload.userId)
    .maybeSingle();

  if (tokenError) return Response.json({ error: tokenError.message }, { status: 500 });
  if (!tokenRow) return Response.json({ delivered: false, reason: 'No push token registered' });

  const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: tokenRow.token,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      sound: 'default',
      channelId: 'bookease',
    }),
  });

  const expoResult = await expoResponse.json();
  if (!expoResponse.ok) {
    return Response.json({ error: 'Expo push request failed', details: expoResult }, { status: 502 });
  }

  return Response.json({ delivered: true, result: expoResult });
});
