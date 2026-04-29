import { SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material';
import { memo, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDPage } from '../../../../shared/components/layout/crudPage/CRUDPage';
import { FilterType } from '../../../../shared/enums/filterType';
import { InvoiceType } from '../../../../shared/enums/invoiceType';
import { useItemsRetrieve } from '../../../../shared/hooks/items/useItemsRetrieve';
import type { Filter, FilterData } from '../../../../shared/types/filter';
import type { CustomFieldMeta, ItemForm } from '../../../../shared/types/invoice';
import type { Item, ItemAdd, ItemUpdate } from '../../../../shared/types/item';
import type { Response } from '../../../../shared/types/response';
import { computePrice } from '../../../../shared/utils/computePrice';
import { createCommonFilters, createInvoiceFilters } from '../../../../shared/utils/filterSortFunctions';
import {
  currencyCodeToOutputCurrency,
  priceParamsFromSettings
} from '../../../../shared/utils/priceCalculatorFromSettings';
import { useAppSelector } from '../../../../state/configureStore';
import { selectSettings } from '../../../../state/pageSlice';
import { List as ItemsList } from '../../../items/List';
import { ItemMetadataSetter } from '../Modals/ItemMetadataSetter';

interface Props {
  isOpen: boolean;
  type: InvoiceType;
  headerOptions: CustomFieldMeta[];
  /** Invoice document currency code — used with quotations to pick USD / ZAR / RTGS pricing branch. */
  invoiceCurrencyCode?: string | null;
  onClose?: () => void;
  onOpen?: () => void;
  onClick?: (item: Item, data: ItemForm) => void;
}

const ItemsDropdownComponent: FC<Props> = ({
  isOpen,
  type,
  headerOptions,
  invoiceCurrencyCode,
  onClose,
  onOpen,
  onClick
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const { t } = useTranslation();
  const filters: Filter[] = [
    ...createCommonFilters({ t, namespace: 'items', initial: FilterType.active }),
    ...createInvoiceFilters({ t, namespace: 'items' })
  ];
  const useItemsCRUDRetrieve = (args: { filter?: FilterData[]; onDone?: (data: Response<Item[]>) => void }) => {
    const { items, execute } = useItemsRetrieve({ filter: args.filter, onDone: args.onDone });
    return { items: items, execute };
  };
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const storeSettings = useAppSelector(selectSettings);

  const suggestedUnitPrice = useMemo(() => {
    if (!selectedItem) return 0;
    if (type !== InvoiceType.quotation) {
      return Number(selectedItem.amount ?? 0);
    }
    return computePrice({
      randCost: Number(selectedItem.amount ?? 0),
      qty: 1,
      ...priceParamsFromSettings(storeSettings),
      currency: currencyCodeToOutputCurrency(invoiceCurrencyCode ?? undefined)
    }).unitPrice;
  }, [type, selectedItem, storeSettings, invoiceCurrencyCode]);

  return (
    <>
      {isOpen && (
        <ItemMetadataSetter
          type={type}
          headerOptions={headerOptions}
          currUnitPrice={suggestedUnitPrice}
          priceAfterExpense={type === InvoiceType.quotation ? suggestedUnitPrice : undefined}
          usePriceAfterExpenseAsUnitPrice={type === InvoiceType.quotation}
          isOpen={selectedItem !== undefined}
          onCancel={() => setSelectedItem(undefined)}
          onSave={data => {
            if (selectedItem) onClick?.(selectedItem, data);
            setSelectedItem(undefined);
          }}
        />
      )}

      {!selectedItem && (
        <SwipeableDrawer
          anchor="bottom"
          open={isOpen}
          onClose={() => onClose?.()}
          onOpen={() => onOpen?.()}
          slotProps={{
            paper: {
              sx: {
                maxWidth: isDesktop ? '40%' : '100%',
                height: '80%',
                mx: 'auto',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                p: 3
              }
            }
          }}
        >
          <CRUDPage<Item, ItemAdd, ItemUpdate>
            componentId="invoices:items"
            filters={filters}
            showRightSide={false}
            showAddButton={false}
            useRetrieve={useItemsCRUDRetrieve}
            searchField={'name'}
            sortOptions={[
              { label: t('common.name'), value: 'name' },
              { label: t('common.lastUpdate'), value: 'updatedAt' }
            ]}
            noItemText={t('items.noItem')}
            renderListItem={(item, selectedItem) => (
              <ItemsList
                key={item.id}
                item={item}
                showDeleteButton={false}
                selectedItem={selectedItem}
                onEdit={(editItem: Item) => setSelectedItem(editItem)}
              />
            )}
          />
        </SwipeableDrawer>
      )}
    </>
  );
};
export const ItemsDropdown = memo(ItemsDropdownComponent);
