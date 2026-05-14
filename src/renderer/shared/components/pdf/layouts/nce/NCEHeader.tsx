import { Text, View } from '@react-pdf/renderer';
import type { NCELayoutData } from './types';
import { nceStyles } from './styles';

type Props = Pick<
  NCELayoutData,
  | 'issuedAt'
  | 'refNumber'
  | 'businessName'
  | 'businessAddress'
  | 'businessPhone'
  | 'businessEmail'
  | 'businessAdditional'
>;

export const NCEHeader = (props: Props) => (
  <View style={nceStyles.header}>
    
    <View style={nceStyles.companyInfo}>
    <Image
  style={styles.logoImage}
  src="https://northerncateringe.co.zw/wp-content/uploads/2023/09/NORTHERN.png"
/>
      {props.businessName ? <Text style={nceStyles.bold}>{props.businessName}</Text> : null}
      {props.businessAddress ? <Text>{props.businessAddress}</Text> : null}
      {props.businessPhone ? <Text>Mobile: {props.businessPhone}</Text> : null}
      {props.businessEmail ? <Text>Email: {props.businessEmail}</Text> : null}
      {props.businessAdditional ? <Text>{props.businessAdditional}</Text> : null}
    </View>
    <View style={nceStyles.refBlock}>
      <Text>{props.issuedAt ? new Date(props.issuedAt).toLocaleDateString() : new Date().toLocaleDateString()}</Text>
      <Text style={nceStyles.bold}>Ref: {props.refNumber}</Text>
    </View>
  </View>
);
