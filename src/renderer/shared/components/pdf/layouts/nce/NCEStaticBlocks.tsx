import { Text, View } from '@react-pdf/renderer';
import { nceStyles } from './styles';

export const NCEDeliveryFooter = () => (
  <View style={nceStyles.footer}>
    <Text>Delivery Time: 1-2 working weeks from date of payment.</Text>
    <Text>This quote is valid for seven working days.</Text>
  </View>
);

export const NCEPricesBasisFooter = () => (
  <View style={nceStyles.footer}>
    <Text>PRICES BASIS</Text>
    <Text>All goods remain the property of Northern Catering Equipment P/L until paid in full.</Text>
    <Text>
      Value of goods will be at current price list at the time of invoice and all goods must be fully paid for before
      delivery/collection. We require 100% payment with order . This quote is valid for seven working days
    </Text>
  </View>
);

export const NCEBankDetails = () => (
  <View style={nceStyles.bankDetails}>
    <Text style={nceStyles.bold}>BANK DETAILS USD ACCOUNT</Text>
    <Text>ACCOUNT NAME: NORTHERN CATERING EQUIPMENT P/L</Text>
    <Text>BANK NAME: CROWN BANK</Text>
    <Text>ACCOUNT NO: 8740409928400</Text>
    <Text>BRANCH :AFRICA UNITY SQUARE</Text>
    <Text>BRANCH CODE : 04000</Text>
    <Text>SWIFT CODE : SCBLZWHXXXX</Text>
  </View>
);

export const NCEClosingLetter = () => (
  <View style={nceStyles.footer}>
    <Text>We hope the above is in line with your requirements and assure you of our best</Text>
    <Text>services and attention at all times .</Text>
  </View>
);

export const NCESignatureBlock = () => (
  <View style={nceStyles.footer}>
    <Text>Yours faithfully</Text>
    <Text>Fadzanayi Sadomba</Text>
    <Text>Sales & Marketing : 0772 268 623</Text>
  </View>
);
