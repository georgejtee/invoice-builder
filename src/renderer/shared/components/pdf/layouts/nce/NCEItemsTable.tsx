import { Text, View } from '@react-pdf/renderer';
import type { NCEItem } from './types';
import { nceStyles } from './styles';

export interface NCEItemsTableProps {
  items: NCEItem[];
  totalFormatted: string;
}

export const NCEItemsTable = ({ items, totalFormatted }: NCEItemsTableProps) => (
  <View style={nceStyles.table}>
    <View style={nceStyles.tableRow}>
      <View style={[nceStyles.tableColHeader, { width: '15%' }]}>
        <Text style={nceStyles.cell}>QUANTITY</Text>
      </View>
      <View style={[nceStyles.tableColHeader, { width: '15%' }]}>
        <Text style={nceStyles.cell}>CODE</Text>
      </View>
      <View style={[nceStyles.tableColHeader, { width: '40%' }]}>
        <Text style={nceStyles.cell}>DESCRIPTION</Text>
      </View>
      <View style={[nceStyles.tableColHeader, { width: '15%' }]}>
        <Text style={nceStyles.cell}>UNIT PRICE</Text>
      </View>
      <View style={[nceStyles.tableColHeader, { width: '15%' }]}>
        <Text style={nceStyles.cell}>TOTAL</Text>
      </View>
    </View>
    {items.map((item, i) => (
      <View style={nceStyles.tableRow} key={i}>
        <View style={[nceStyles.tableCol, { width: '15%' }]}>
          <Text style={nceStyles.cell}>{item.quantity}</Text>
        </View>
        <View style={[nceStyles.tableCol, { width: '15%' }]}>
          <Text style={nceStyles.cell}>{item.code}</Text>
        </View>
        <View style={[nceStyles.tableCol, { width: '40%' }]}>
          <Text style={nceStyles.cell}>{item.name}</Text>
        </View>
        <View style={[nceStyles.tableCol, { width: '15%' }]}>
          <Text style={nceStyles.cell}>{item.unitPrice}</Text>
        </View>
        <View style={[nceStyles.tableCol, { width: '15%' }]}>
          <Text style={nceStyles.cell}>{item.totalPrice}</Text>
        </View>
      </View>
    ))}
    <View style={nceStyles.tableRow}>
      <View style={[nceStyles.tableCol, { width: '85%' }]}>
        <Text style={[nceStyles.cell, nceStyles.bold, { textAlign: 'right' }]}>TOTAL</Text>
      </View>
      <View style={[nceStyles.tableCol, { width: '15%' }]}>
        <Text style={[nceStyles.cell, nceStyles.bold]}>{totalFormatted}</Text>
      </View>
    </View>
  </View>
);
