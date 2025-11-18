import React, {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import GBottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';

import {
  Container,
  Option,
  ActionIcon,
  Info,
  ActionText,
  DescriptionText,
  Circle,
  Header,
  Input,
  Loading,
} from './styles';
import {useBackHandler} from '@react-native-community/hooks';
import {ActivityIndicator, Dimensions} from 'react-native';
import Constants from 'expo-constants';
import {Portal} from '@gorhom/portal';
import Ionicons from '@expo/vector-icons/Ionicons';
import {colors} from 'assets/colors';
import {StatusBar} from 'expo-status-bar';

export interface BottomSheetOptionProps {
  label: string;
  description?: string;
  icon?: string;
  visible?: boolean;
  loading?: boolean;
  onPress?: () => void;
  closeOnPress?: boolean;
}

export interface BottomSheetRefProps {
  open: () => void;
  close: () => void;
}

export interface BottomSheetProps {
  options?: BottomSheetOptionProps[];
  searchable?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  height?: number;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

const BottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({options, searchable, onClose, children, height}, ref) => {
    const bottomSheetRef = createRef<GBottomSheet>();
    const [search, setSearch] = useState('');

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    const open = () => {
      bottomSheetRef.current?.expand();
      //setOpen(true);
    };

    const close = () => {
      bottomSheetRef.current?.close();
      if (onClose) onClose();
    };

    useBackHandler(() => {
      return false;
    });

    const handleOptionPress = (callback?: () => void, closeOnPress = true) => {
      if (callback) callback();
      if (closeOnPress) close();
    };

    const filteredOptions = (options ?? []).filter(
      ({visible = true}) => visible,
    );

    const searchableOptions = filteredOptions
      .filter(
        (item) =>
          item.label
            .toLocaleLowerCase()
            .search(search ? search.toLocaleLowerCase() : search) >= 0,
      )
      .sort((a, b) =>
        a.label.localeCompare(b.label, 'es', {sensitivity: 'base'}),
      );

    const bottomSheetOption = searchable ? searchableOptions : filteredOptions;

    const onChange = (index: number) => {
      if (index === -1 && close) close();
    };

    return (
      <Portal>
        <StatusBar
          backgroundColor="rgba(128, 128, 128, .5)"
          translucent={false}
          hideTransitionAnimation="fade"
        />
        <GBottomSheet
          index={0}
          ref={bottomSheetRef}
          snapPoints={[
            height ??
              Math.min(
                (filteredOptions.length + 1) * 55 + 50 + (searchable ? 30 : 0),
                SCREEN_HEIGHT - Constants.statusBarHeight - 30,
              ),
          ]}
          {...{onChange}}
          enablePanDownToClose={true}
          backdropComponent={(props) => (
            <BottomSheetBackdrop {...{...props, disappearsOnIndex: -1}} />
          )}>
          {options && searchable && (
            <Header>
              <Ionicons name="search-outline" size={18} color="black" />
              <Input
                value={search}
                placeholder="Pesquisar registros"
                onChangeText={setSearch}
              />
            </Header>
          )}
          <BottomSheetFlatList
            data={bottomSheetOption}
            ListFooterComponent={
              <Option onPress={close}>
                <Circle>
                  <ActionIcon size={18} name={'close'} />
                </Circle>
                <Info>
                  <ActionText>Cancelar</ActionText>
                </Info>
              </Option>
            }
            renderItem={({
              item: {label, icon, onPress, closeOnPress, loading, description},
              index,
            }) => (
              <Option
                onPress={() => handleOptionPress(onPress, closeOnPress)}
                key={index}
                disabled={loading}>
                <Circle>
                  <ActionIcon
                    size={18}
                    name={icon ? (icon as any) : 'checkmark-outline'}
                  />
                </Circle>
                <Info>
                  <ActionText>{label}</ActionText>
                  {description && (
                    <DescriptionText numberOfLines={1}>
                      {description}
                    </DescriptionText>
                  )}
                </Info>
                {loading && (
                  <Loading>
                    <ActivityIndicator size={26} color={colors.primary} />
                  </Loading>
                )}
              </Option>
            )}>
            {/* {options && (
              <Container>
                <Option onPress={close}>
                  <Circle>
                    <ActionIcon size={18} name={'ios-close'} />
                  </Circle>
                  <ActionText>Cancelar</ActionText>
                </Option>
              </Container>
            )} */}
            {!options && children}
          </BottomSheetFlatList>
        </GBottomSheet>
      </Portal>
    );
  },
);

export default BottomSheet;
