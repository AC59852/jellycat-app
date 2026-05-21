import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { File, Paths } from 'expo-file-system';
import { COLLECTION_IMAGES } from '@/constants/collectionImages';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface OnboardingProps {
  onComplete: (name: string, imageIndex: number) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { width } = useWindowDimensions();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [nameError, setNameError] = useState('');
  const insets = useSafeAreaInsets();

  const thumbSize = (width - 20 - 24) / 3;

  const goToStep2 = () => {
    if (!name.trim()) {
      setNameError('Please enter your name to continue.');
      return;
    }
    setNameError('');
    setStep(2);
  };

  const finish = () => {
    try {
      const profileFile = new File(Paths.document, 'user-profile.json');
      profileFile.write(JSON.stringify({
        name: name.trim(),
        imageIndex: selectedImage,
        onboardingComplete: true,
      }));
      onComplete(name.trim(), selectedImage);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  // ── Step 1: Name ──
  if (step === 1) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.nameContent}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={styles.heading}>What's your name?</Text>
          <Text style={styles.subheading}>This is how you'll appear on your profile.</Text>

          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            placeholder="Your name"
            placeholderTextColor="#AAAAAA"
            value={name}
            onChangeText={(t) => { setName(t); setNameError(''); }}
            autoFocus
            maxLength={30}
            returnKeyType="next"
            onSubmitEditing={goToStep2}
          />
          {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}

          <TouchableOpacity style={styles.primaryButton} onPress={goToStep2}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ── Step 2: Image picker ──
  return (
    <SafeAreaView style={styles.container}>
    <Text style={styles.heading}>Select Your Profile Image</Text>

      {/* Scrollable thumbnails only */}
      <ScrollView
        style={styles.thumbScroll}
        contentContainerStyle={[styles.thumbGrid]}
        showsVerticalScrollIndicator={false}
      >
        {COLLECTION_IMAGES.map((img, index) => (
          <TouchableOpacity
            key={img.label}
            onPress={() => setSelectedImage(index)}
            style={[
              styles.thumbWrapper,
              { width: thumbSize, height: thumbSize },
              selectedImage === index && styles.thumbSelected,
            ]}
          >
            <Image
              source={img.image}
              style={{ width: '100%', height: '100%', borderRadius: 999 }}
              resizeMode="cover"
            />
            {selectedImage === index && (
              <View style={styles.thumbCheckOverlay}>
                <Text style={styles.thumbCheck}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pinned bottom button + dots */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 60 }]}>
        <TouchableOpacity style={styles.primaryButton} onPress={finish}>
          <Text style={styles.primaryButtonText}>Let's go</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 20
  },

  // Step 1
  nameContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 16,
    textAlign: 'center',
  },
  heading: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 20,
    color: '#111111',
    marginBottom: 20,
    textAlign: 'center',
  },
  subheading: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 15,
    color: '#747474',
    marginBottom: 36,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Rubik_400Regular',
    fontSize: 17,
    color: '#111111',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 6,
  },
  inputError: {
    borderColor: '#E53935',
  },
  errorText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: '#E53935',
    marginBottom: 4,
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#4570FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },

  // Step 2
  imageTopSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  largePreviewWrapper: {
    width: 170,
    height: 170,
    borderRadius: "100%",
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
    marginTop: 20,
  },
  largePreview: {
    width: '100%',
    height: '100%',
  },
  thumbScroll: {
    flex: 1,
  },
  thumbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    paddingBottom: 16,
    justifyContent: 'center',
  },
  thumbWrapper: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  thumbSelected: {
    borderColor: '#4570FF',
  },
  thumbCheckOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(69,112,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbCheck: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Rubik_700Bold',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});