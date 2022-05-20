const euList = [
  { country: 'Austria', code: 'AT', vat: 20 },
  { country: 'Belgium', code: 'BE', vat: 21 },
  { country: 'Bulgaria', code: 'BG', vat: 20 },
  { country: 'Croatia', code: 'HR', vat: 25 },
  { country: 'Cyprus', code: 'CY', vat: 19 },
  { country: 'Czech Republic', code: 'CZ', vat: 21 },
  { country: 'Denmark', code: 'DK', vat: 25 },
  { country: 'Estonia', code: 'EE', vat: 20 },
  { country: 'Finland', code: 'FI', vat: 24 },
  { country: 'France', code: 'FR', vat: 20 },
  { country: 'Germany', code: 'DE', vat: 19 },
  { country: 'Greece', code: 'GR', vat: 24 },
  { country: 'Hungary', code: 'HU', vat: 27 },
  { country: 'Ireland', code: 'IE', vat: 23 },
  { country: 'Italy', code: 'IT', vat: 22 },
  { country: 'Latvia', code: 'LV', vat: 21 },
  { country: 'Lithuania', code: 'LT', vat: 21 },
  { country: 'Luxembourg', code: 'LU', vat: 17 },
  { country: 'Malta', code: 'MT', vat: 18 },
  { country: 'Netherlands', code: 'NL', vat: 21 },
  { country: 'Poland', code: 'PL', vat: 23 },
  { country: 'Portugal', code: 'PT', vat: 23 },
  { country: 'Romania', code: 'RO', vat: 19 },
  { country: 'Slovakia', code: 'SK', vat: 20 },
  { country: 'Slovenia', code: 'SI', vat: 22 },
  { country: 'Spain', code: 'ES', vat: 21 },
  { country: 'Sweden', code: 'SE', vat: 25 },
];

export const isValidEUVat = (vatId: string) =>
  /^((AT)?U[0-9]{8}|(BE)?0[0-9]{9}|(BG)?[0-9]{9,10}|(CY)?[0-9]{8}L|(CZ)?[0-9]{8,10}|(DE)?[0-9]{9}|(DK)?[0-9]{8}|(EE)?[0-9]{9}|(EL|GR)?[0-9]{9}|(ES)?[0-9A-Z][0-9]{7}[0-9A-Z]|(FI)?[0-9]{8}|(FR)?[0-9A-Z]{2}[0-9]{9}|(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})|(HU)?[0-9]{8}|(IE)\w*$|(IT)?[0-9]{11}|(LT)?([0-9]{9}|[0-9]{12})|(LU)?[0-9]{8}|(LV)?[0-9]{11}|(MT)?[0-9]{8}|(NL)?[0-9]{9}B[0-9]{2}|(PL)?[0-9]{10}|(PT)?[0-9]{9}|(RO)?[0-9]{2,10}|(SE)?[0-9]{12}|(SI)?[0-9]{8}|(SK)?[0-9]{10})$/.test(
    vatId,
  );

export const isEuCountry = (countryCode: string) =>
  !!euList.find((el) => el.code === countryCode);

export const getTaxForCountry = () => {
  return 21;
};

/* returns tax value int if has to pay tax, return null if customer does not need to pay tax (reverse charge) */
export const getTaxFromCustomer = (customer: any) => {
  if (customer?.tax_exempt === 'none') {
    return getTaxForCountry();
  }

  return null;
};

/* returns tax value int if has to pay tax, return null if customer does not need to pay tax (reverse charge) */
export const getTaxFromBillingDetails = (billingDetails: any) => {
  const isEuCountryWithNoVatId =
    isEuCountry(billingDetails?.address?.country) && !billingDetails.vatid;
  if (billingDetails?.isParticular || isEuCountryWithNoVatId) {
    return getTaxForCountry();
  }

  return null;
};
