import { useState } from 'react';
import { useRouter } from 'expo-router';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Alert
} from 'react-native';

import AppInput from '../src/components/AppInput';
import AppButton from '../src/components/AppButton';
import { signIn } from '../src/Services/authService';

export default function Login() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if(!email.trim() || !password.trim()){
            Alert.alert('Atenção', 'Informe seu e-mail e senha'),
            console.log('Atenção', 'Informe seu e-mail e senha');
            return;
        }
        try {
            setLoading(true);
            const {error}= await signIn(email.trim(), password.trim());
            if(error){
                Alert.alert('Erro', error.message);
                console.log('Erro', error.message);
                return;
            }
            router.replace('/(app)/home');
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.card}>

                <Text style={styles.title}>
                    Meu Bolso
                </Text>

                <Text style={styles.subtitle}>
                    Controle suas finanças.
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

                <AppButton title="Entrar" loading={loading} onPress={handleLogin}/>

                <TouchableOpacity
                    onPress={() => router.push('/register')}
                >
                    <Text style={styles.link}>
                        Criar nova conta
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
        fontSize: 36,
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