/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
  titleStyle: StyleProp<TextStyle>;
  descriptionStyle: StyleProp<TextStyle>;
}>;

function Section({
  children,
  title,
  titleStyle,
  descriptionStyle,
}: SectionProps): JSX.Element {
  return (
    <View style={styles.sectionContainer}>
      <Text style={titleStyle}>{title}</Text>
      <Text style={descriptionStyle}>{children}</Text>
    </View>
  );
}

const MemoizedSection = React.memo(Section);

const StickyHeader = ({
  counter,
  isDarkMode,
  onPress,
}: {
  counter?: number;
  isDarkMode: boolean;
  onPress: () => void;
}) => {
  const goThemeText = isDarkMode ? 'Go light' : 'Go dark';

  return (
    <Pressable onPress={onPress}>
      {
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            backgroundColor: !isDarkMode ? Colors.darker : Colors.lighter,
            alignItems: 'center',
            justifyContent: 'center',
            height: 80,
          }}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              color: isDarkMode ? Colors.darker : Colors.lighter,
              fontWeight: 'bold',
            }}>
            {counter === undefined ? goThemeText : `increment: ${counter}`}
          </Text>
        </View>
      }
    </Pressable>
  );
};

const ItemsWithUseMemo = ({
  isDarkMode,
  index,
  SectionItem,
}: {
  isDarkMode: boolean;
  SectionItem: typeof Section | typeof MemoizedSection;
  index: number;
}) => {
  const titleStyle = React.useMemo(
    () => [
      styles.sectionTitle,
      {color: isDarkMode ? Colors.white : Colors.black},
    ],
    [isDarkMode],
  );
  const descriptionstyle = React.useMemo(
    () => [
      styles.sectionDescription,
      {color: isDarkMode ? Colors.light : Colors.dark},
    ],
    [isDarkMode],
  );

  return (
    <SectionItem
      title={`Item ${index}`}
      titleStyle={titleStyle}
      descriptionStyle={descriptionstyle}>
      {`Description ${index}`}
    </SectionItem>
  );
};

const ItemsPlainStyles = ({
  isDarkMode,
  index,
  SectionItem,
}: {
  isDarkMode: boolean;
  SectionItem: typeof Section | typeof MemoizedSection;
  index: number;
}) => {
  const titleStyle = [
    styles.sectionTitle,
    {color: isDarkMode ? Colors.white : Colors.black},
  ];
  const descriptionstyle = [
    styles.sectionDescription,
    {color: isDarkMode ? Colors.light : Colors.dark},
  ];

  return (
    <SectionItem
      title={`Item ${index}`}
      titleStyle={titleStyle}
      descriptionStyle={descriptionstyle}>
      {`Description ${index}`}
    </SectionItem>
  );
};

const runners: Record<
  'ItemsWithUseMemo' | 'ItemsPlainStyles',
  typeof ItemsWithUseMemo | typeof ItemsPlainStyles
> = {
  ItemsWithUseMemo,
  ItemsPlainStyles,
};
const sections: Record<
  'Section' | 'MemoizedSection',
  typeof Section | typeof MemoizedSection
> = {
  Section,
  MemoizedSection,
};

const Runner = ({
  isDarkMode,
  counter,
  RunnerKey,
  SectionKey,
  total,
}: {
  isDarkMode: boolean;
  counter: number;
  RunnerKey: keyof typeof runners;
  SectionKey: keyof typeof sections;
  total: number;
}) => {
  const Items = runners[RunnerKey];
  const SectionItem = sections[SectionKey];

  return (
    <>
      <Section
        title={'Counter'}
        titleStyle={[
          styles.sectionTitle,
          {color: isDarkMode ? Colors.white : Colors.black},
        ]}
        descriptionStyle={[
          styles.sectionDescription,
          {color: isDarkMode ? Colors.light : Colors.dark},
        ]}>{`Using ${RunnerKey} with ${SectionKey} (${counter})`}</Section>
      {Array.from(new Array(total), (_, i) => i).map(i => (
        <Items
          key={`item-${i}`}
          isDarkMode={isDarkMode}
          SectionItem={SectionItem}
          index={i}
        />
      ))}
    </>
  );
};

function App(): JSX.Element {
  const [isDarkMode, setIsDarkMode] = React.useState(
    useColorScheme() === 'dark',
  );
  const [counter, setCounter] = React.useState(0);
  const toggleDarkMode = React.useCallback(() => {
    setIsDarkMode(darkMode => !darkMode);
  }, []);
  const incrementCounter = React.useCallback(() => {
    setCounter(c => c + 1);
  }, []);

  const changingColor = isDarkMode ? Colors.darker : Colors.lighter;
  const backgroundStyle = {
    backgroundColor: changingColor,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        stickyHeaderIndices={[0, 1]}
        style={backgroundStyle}>
        <StickyHeader onPress={toggleDarkMode} isDarkMode={isDarkMode} />
        <StickyHeader
          counter={counter}
          onPress={incrementCounter}
          isDarkMode={isDarkMode}
        />
        <Runner
          RunnerKey={'ItemsWithUseMemo'}
          SectionKey={'MemoizedSection'}
          isDarkMode={isDarkMode}
          counter={counter}
          total={500}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});

export default App;
