import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useRouter } from 'expo-router';
import AppButton from '../src/components/AppButton';
import AppInput from '../src/components/AppInput';

export default function Register() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.card}>

                <Text style={styles.title}>
                    MEU BOLSO - Criar conta
                </Text>

                <Text style={styles.subtitle}>
                    Crie sua conta
                </Text>

                <AppInput
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <AppInput
                    label="Senha"
                    secureTextEntry
                    placeholder="Digite sua senha"
                    value={password}
                    onChangeText={setPassword}
                />

                <AppInput
                    label="Confirmar senha"
                    secureTextEntry
                    placeholder="Digite sua senha novamente"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <AppButton title="Criar conta" />

                <TouchableOpacity
                    onPress={() => router.push('/')}
                >
                    <Text style={styles.link}>
                        Já tenho uma conta
                    </Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#eef7f4'
    },

    card: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        padding: 30,
        borderRadius: 24,

        elevation: 6,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.12,
        shadowRadius: 10
    },

    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#008f72',
        textAlign: 'center',
        marginBottom: 8
    },

    subtitle: {
        color: '#7f8c8d',
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 30
    },

    link: {
        color: '#008f72',
        textAlign: 'center',
        marginTop: 22,
        fontWeight: '700',
        fontSize: 15
    }
});