import { TamaguiProvider, createTamagui } from '@tamagui/core';
import { defaultConfig } from '@tamagui/config/v5';
import { Button, View, Text, H1, H5, Separator, ScrollView } from 'tamagui';
import { useState } from 'react';
import {
  StatusBar,
  useWindowDimensions,
  TouchableHighlight,
  type GestureResponderEvent,
} from 'react-native';

// you usually export this from a tamagui.config.ts file
const config = createTamagui(defaultConfig);

type Conf = typeof config;

// make imports typed
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

interface EventStore {
  event: GestureResponderEvent;
  nativeEvent: GestureResponderEvent['nativeEvent'];
}

/*
 * Ignore this
 * It just makes an object stringifiable that has a reference to itself
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
 */
function getCircularReplacer() {
  const ancestors = [];
  return function (key, value) {
    console.log('Replacer property', key, value);
    if (value === null) {
      return value;
    }
    if (typeof value === 'object' && key) return '[object][object]';
    // `this` is the object that value is contained in,
    // i.e., its direct parent.
    while (ancestors.length > 0 && ancestors.at(-1) !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(value)) {
      return '[Circular]';
    }
    ancestors.push(value);
    return value;
  };
}

export default () => {
  const [longPressEvent, setLongPressEvent] = useState<EventStore | null>(null);
  const [pressEvent, setPressEvent] = useState<EventStore | null>(null);
  const [touchableHighlightEvent, setTouchableHightlighEvent] =
    useState<EventStore | null>(null);

  const screen = useWindowDimensions();

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      {
        <View
          flex={1}
          justify="center"
          items="center"
          bg="$background"
          p="$4"
          pt={StatusBar?.currentHeight + 100}
        >
          <H1 mb="$5">Demo</H1>
          <ScrollView>
            <View mb="$3">
              <Button
                onLongPress={e => {
                  console.log(e, e.nativeEvent);
                  setLongPressEvent({
                    event: Object.assign({}, e),
                    nativeEvent: Object.assign({}, e.nativeEvent),
                  });
                }}
              >
                Long Press Me
              </Button>
              {longPressEvent !== null ? (
                <View>
                  <H5>Event</H5>
                  <Text>
                    {JSON.stringify(
                      longPressEvent.event,
                      getCircularReplacer(),
                      4,
                    )}
                  </Text>
                  <Separator />
                  <H5>Native Event</H5>
                  <Text>
                    {JSON.stringify(
                      longPressEvent.nativeEvent,
                      getCircularReplacer(),
                      4,
                    )}
                  </Text>
                </View>
              ) : null}
            </View>
            <View mb="$3">
              <Button
                onPress={e => {
                  console.log('Press Event', e, e.nativeEvent);
                  setPressEvent({
                    event: Object.assign({}, e),
                    nativeEvent: Object.assign({}, e.nativeEvent),
                  });
                }}
              >
                Press Me
              </Button>

              {pressEvent !== null ? (
                <View>
                  <H5>Event</H5>
                  <Text>
                    {JSON.stringify(pressEvent.event, getCircularReplacer(), 4)}
                  </Text>
                  <Separator />
                  <H5>Native Event</H5>
                  <Text>
                    {JSON.stringify(
                      pressEvent.nativeEvent,
                      getCircularReplacer(),
                      4,
                    )}
                  </Text>
                </View>
              ) : null}
            </View>
            <View>
              <TouchableHighlight
                onLongPress={e => {
                  console.log(e, e.nativeEvent);
                  setTouchableHightlighEvent({
                    event: Object.assign({}, e),
                    nativeEvent: Object.assign({}, e.nativeEvent),
                  });
                }}
              >
                <Text
                  bg="$color4"
                  p="$3"
                  rounded="$4"
                  fontSize="$4"
                  text="center"
                >
                  Touchable Highlight (Pressable also works)
                </Text>
              </TouchableHighlight>
              {touchableHighlightEvent !== null ? (
                <View>
                  <H5>Event</H5>
                  <Text>
                    {JSON.stringify(
                      touchableHighlightEvent.event,
                      getCircularReplacer(),
                      4,
                    )}
                  </Text>
                  <Separator />
                  <H5>Native Event</H5>
                  <Text>
                    {JSON.stringify(
                      touchableHighlightEvent.nativeEvent,
                      getCircularReplacer(),
                      4,
                    )}
                  </Text>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </View>
      }
    </TamaguiProvider>
  );
};
