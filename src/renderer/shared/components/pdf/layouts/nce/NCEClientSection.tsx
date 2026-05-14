import { Text, View } from '@react-pdf/renderer';
import type { NCELayoutData } from './types';
import { nceStyles } from './styles';

type Props = Pick<
  NCELayoutData,
  | 'clientName'
  | 'clientCompanyName'
  | 'clientAddress'
  | 'clientEmail'
  | 'clientPhone'
  | 'clientAdditional'
  | 'projectName'
>;

export const NCEClientSection = (props: Props) => (
  <>
    <View style={{ marginTop: 20, marginBottom: 10 }}>
      {props.clientName ? <Text style={nceStyles.bold}>Attention: {props.clientName}</Text> : null}
      {props.clientCompanyName ? <Text>Company: {props.clientCompanyName}</Text> : null}
      {props.clientAddress ? <Text>Address: {props.clientAddress}</Text> : null}
      {props.clientEmail ? <Text>Email: {props.clientEmail}</Text> : null}
      {props.clientPhone ? <Text>Mobile: {props.clientPhone}</Text> : null}
      {props.clientAdditional ? <Text>{props.clientAdditional}</Text> : null}
    </View>
    <Text style={[nceStyles.bold, { marginBottom: 10 }]}>{props.projectName}</Text>
  </>
);
