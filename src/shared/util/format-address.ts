import { AddressProps } from "modules/attendances/types";

export default (address: AddressProps) => {
  const { name, street, city, state, streetNumber, neighborhood } = address;

  let formattedAddress = "";

  if (name) formattedAddress = `${name} - `;
  if (street)
    formattedAddress
      ? (formattedAddress += street)
      : (formattedAddress = street);
  if (streetNumber) formattedAddress += `, ${streetNumber}`;
  if (neighborhood && !formattedAddress) formattedAddress = neighborhood;
  if (neighborhood && formattedAddress)
    formattedAddress += ` - ${neighborhood}`;
  if (city && !formattedAddress) formattedAddress = `${city} - ${state}`;
  if (city && formattedAddress) formattedAddress += ` - ${city} - ${state}`;

  return formattedAddress;
};
