import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { colors, fontFamily, borderRadius } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
            GumiGenk
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
            Premium Trading Journal
          </Text>
        </View>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
            Sign In
          </Text>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="trader@gumigenk.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
            icon="lock-closed-outline"
          />
          <Button
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            size="lg"
            fullWidth
            style={{ marginTop: 12 }}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  card: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default LoginScreen;
