export const CONSENT_POLICY_NAMESPACE = 'CookieConsent';

export const DataHooks = {
  NoConsentBox: 'consent-policy-no-consent-box',
  Tooltip: 'consent-policy-tooltip',
};

export const translationKeysMap = {
  large_element_one_cookie_key:
    'CookieConsent_UoU_Large_Element_One_Cookie_Type',
  large_element_one_cookie_default:
    '<%=componentname%> was blocked due to your cookie and tracking settings. To view, <url>update your <%=cookietype%> settings.<url>',
  large_element_two_cookie_key:
    'CookieConsent_UoU_Large_Element_Two_Cookie_Types',
  large_element_two_cookie_default:
    '<%=componentname%> was blocked due to your cookie and tracking settings. To view, <url>update your <%=cookietype%> and <%=cookietype%> settings.<url>',
  medium_element_one_cookie_key:
    'CookieConsent_UoU_Medium_Element_One_Cookie_Type',
  medium_element_one_cookie_default:
    'To view <%=componentname%>, <url>update your cookie and tracking settings.<url>',
  medium_element_two_cookie_key:
    'CookieConsent_UoU_Medium_Element_Two_Cookie_Types',
  medium_element_two_cookie_default:
    'To view <%=componentname%>, <url>adjust your <%=cookietype%> and <%=cookietype%> cookie and tracking settings.<url>',
  small_element_one_cookie_key:
    'CookieConsent_UoU_Small_Element_One_Cookie_Type',
  small_element_one_cookie_default:
    '<url>Update your cookie and tracking settings<url>',
  small_element_two_cookie_key:
    'CookieConsent_UoU_Small_Element_Two_Cookie_Types',
  small_element_two_cookie_default:
    '<url>Update your cookie and tracking settings<url>',
  small_tooltip_one_cookie_key: 'CookieConsent_UoU_Small_Element_Tooltip',
  small_tooltip_one_cookie_default:
    'To view <%=componentname%>, update your <%=cookietype%> settings.',
  small_tooltip_two_cookie_key:
    'CookieConsent_UoU_Small_Element_Two_Cookie_Types_Tooltip',
  small_tooltip_two_cookie_default:
    'To view <%=componentname%>, update your <%=cookietype%> and <%=cookietype%> settings.',
  small_element_aria_label_key: 'CookieConsent_UoU_Small_Element_Aria_Label',
  small_element_aria_label_default: 'More info',
  tiny_element_one_cookie_key: 'CookieConsent_UoU_Tiny_Element_One_Cookie_Type',
  tiny_element_one_cookie_default:
    '<%=componentname%> was blocked due to your cookie and tracking settings. <url>To view, update your settings.<url>',
  tiny_element_two_cookie_key:
    'CookieConsent_UoU_Tiny_Element_Two_Cookie_Types',
  tiny_element_two_cookie_default:
    '<%=componentname%> was blocked due to your cookie and tracking settings. To view, <url>update your <%=cookietype%> and <%=cookietype%> settings.<url>',
  tiny_element_aria_label_key: 'CookieConsent_UoU_Tiny_Element_Aria_Label',
  tiny_element_aria_label_default: 'Unblock <%=componentname%>',

  analytics_key: 'CookieConsent_Dataset_Cookie_Type_Analytics',
  analytics_default: 'analytics',
  functional_key: 'CookieConsent_Dataset_Cookie_Type_Functional',
  functional_default: 'functional',
  essential_key: 'CookieConsent_Dataset_Cookie_Type_Essential',
  essential_default: 'essential',
  advertising_key: 'CookieConsent_Dataset_Cookie_Type_Marketing',
  advertising_default: 'marketing',
} as const;

export const translationKeys = [
  'large_element_one_cookie',
  'large_element_two_cookie',
  'medium_element_one_cookie',
  'medium_element_two_cookie',
  'small_element_one_cookie',
  'small_element_two_cookie',
  'small_tooltip_one_cookie',
  'small_tooltip_two_cookie',
  'small_element_aria_label',
  'tiny_element_one_cookie',
  'tiny_element_two_cookie',
  'tiny_element_aria_label',
  'analytics',
  'functional',
  'essential',
  'advertising',
  'componentName',
] as const;

export const shouldExportCurrentConsentPolicyExperiment =
  'specs.thunderbolt.shouldExportCurrentConsentPolicy';
