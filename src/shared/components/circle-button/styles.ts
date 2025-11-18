import styled from 'styled-components/native';

export const Container = styled.Pressable.attrs({
  android_ripple: {
    color: 'rgba(128, 128, 128, .2)',
    borderless: true,
  },
})`
  align-items: center;
  justify-content: center;
`;
