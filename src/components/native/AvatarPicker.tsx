import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { uploadAvatar } from '../../lib/storage';

interface AvatarPickerProps {
  uri: string;
  size?: number;
  onPicked: (uri: string) => void;
  label?: string;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  uri,
  size = 80,
  onPicked,
  label = 'Change Photo',
}) => {
  const handlePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Photo library access is needed to change your photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const uploadedUri = await uploadAvatar(result.assets[0].uri);
        onPicked(uploadedUri);
      }
    } catch {
      Alert.alert('Photo Error', 'The photo could not be selected. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={handlePick} style={styles.touchable}>
        <Image
          source={{ uri }}
          style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
        />
        <View style={[styles.overlay, { width: size, height: size, borderRadius: size / 2 }]}>
          <Camera size={size * 0.25} color={Colors.white} />
        </View>
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 6 },
  touchable: { position: 'relative' },
  avatar: { backgroundColor: Colors.outline },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(43,27,46,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.slate,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
