import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import BalanceCard from '../../src/components/BalanceCard';
import AppButton from '../../src/components/AppButton';

export default function Home() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <View>
                <Text style={styles.title}>
                    Meu Bolso
                </Text>

                <Text style={styles.sub}>
                    Resumo financeiro
                </Text>
            </View>
                <Text style={styles.text}>
                    Bem-vindo ao seu controle financeiro!
                    Aqui você poderá acompanhar suas finanças,
                    organizar seus gastos e cuidar melhor do seu dinheiro.
                </Text>

                <TouchableOpacity style={styles.profileButton}>
                    <Text style={styles.profileButtonText}>
                        Perfil
                    </Text>
                </TouchableOpacity>
            </View>

            <BalanceCard balance={5000}/>

                <AppButton title="Gerar relatório PDF" />

                <View style={styles.row}>

                </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '60',
        padding: 24,
        backgroundColor: '#f8f8f8'
        
    },

    header: {
       flexDirection:'row',
       justifyContent:'space-between',
       alignItems:'center',
       paddingVertical:16
    },

    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#2f3640',
        textAlign: 'center',
        
    },

    sub: {
        color: '#7f8c8d',
    },
 
    row: {
      flexDirection: 'row',
      marginHorizontal: -4
    },

    text: {
        color: '#555',
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 23,
        marginBottom: 24,
    },

    profileButton: {
        backgroundColor: '#e5f5ef',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },

    profileButtonText: {
        color: '#008f72',
        fontSize: 16,
        fontWeight: '700',
    },
});