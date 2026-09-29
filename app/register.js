import { useState } from 'react';
import {
    Alert,
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
import { signUp } from '../src/Services/authService';

export default function Register() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if(!email.trim() || !password.trim() || !confirmPassword.trim())
            return Alert.alert('Atenção','Preencha todos os campos');
        if(password.length < 6)
            return Alert.alert('Atenção','A senha deve ter no minimo 6 caracteres');
        if(password!==confirmPassword)
            return Alert.alert('Atenção','As senhas não conferem');

        try{
            setLoading(true);
            const {error} = await signUp(email.trim(), password.trim());
            if(error){
                Alert.alert('Erro no cadastro', error.message);
                console.log('Erro no cadastro', error.message);
                return;
            }
            else {
                Alert.alert('Sucesso!', 'Conta criado com sucesso, Faça o login para continuar.'),
                router.replace('/');
            }
        }finally{
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
                    Criar conta
                </Text>

                <Text style={styles.subtitle}>
                    Crie sua conta no Meu Bolso.
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

                <AppButton 
                   title="Criar conta"
                   loading={loading}
                   onPress={handleRegister}
                />

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