import { Text, StyleSheet } from 'react-native';
import AppCard from './AppCard';
import { formatCurrency } from '../utils/format';
import { Label } from '@react-navigation/elements';

export default function BalanceCard({balance}) {
    return(
       <AppCard style={styles.card}>
         <Text style={styles.label}>Saldo atual</Text>
         <Text style={styles.value}>{formatCurrency(balance)}</Text>
       </AppCard>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2f3640'
  },
  label: {
    color: '#dcdde1',
  },
  value: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 6
  }
})