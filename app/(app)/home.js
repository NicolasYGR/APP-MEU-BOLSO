import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
    return (
        <View style={styles.container}>
            <View style={styles.card}>

                <Text style={styles.title}>
                    Meu Bolso
                </Text>

                <Text style={styles.subtitle}>
                    Bem-vindo ao seu controle financeiro!
                </Text>

                <Text style={styles.text}>
                    Aqui você poderá acompanhar suas finanças,
                    organizar seus gastos e cuidar melhor do seu dinheiro.
                </Text>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#eef7f4',
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
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 10,
    },

    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#008f72',
        textAlign: 'center',
        marginBottom: 8,
    },

    subtitle: {
        color: '#7f8c8d',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },

    text: {
        color: '#555',
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 23,
    },

});



