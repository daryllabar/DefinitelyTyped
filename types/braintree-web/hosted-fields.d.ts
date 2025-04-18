import { Client } from "./client";
import { callback } from "./core";

export interface HostedFieldsFieldMaskInput {
    /**
     * The character to use when masking the input.
     * @default '•'
     */
    character?: string | undefined;
    /**
     * Only applicable for the credit card field. Whether or not to show the last 4 digits of the card when masking.
     */
    showLastFour?: boolean | undefined;
}

export interface HostedFieldsFieldSupportedCardBrands {
    /**
     * The options for supporting card brands as either valid or invalid.
     * Only applicable for the credit card number field.
     * An object used in {@link module:braintree-web/hosted-fields~field field objects}
     */
    visa?: boolean | undefined;
    mastercard?: boolean | undefined;
    "american-express"?: boolean | undefined;
    "diners-club"?: boolean | undefined;
    discover?: boolean | undefined;
    jcb?: boolean | undefined;
    "union-pay"?: boolean | undefined;
    maestro?: boolean | undefined;
    elo?: boolean | undefined;
    mir?: boolean | undefined;
    hiper?: boolean | undefined;
    hipercard?: boolean | undefined;
}

/**
 * Fields used in {@link module:braintree-web/hosted-fields~fieldOptions fields options}
 */
export interface HostedFieldsField {
    /**
     * @deprecated Now an alias for `container`.
     */
    selector?: string | undefined;
    container?: string | HTMLElement | undefined;
    placeholder?: string | undefined;
    type?: string | undefined;
    formatInput?: boolean | undefined;
    maskInput?: boolean | HostedFieldsFieldMaskInput | undefined;
    select?: boolean | { options: string[] } | undefined;
    maxCardLength?: number | undefined;
    maxlength?: number | undefined;
    minlength?: number | undefined;
    prefill?: string | undefined;
    rejectUnsupportedCards?: boolean | undefined;
    supportedCardBrands?: HostedFieldsFieldSupportedCardBrands | undefined;
}

/**
 * An object that has {@link module:braintree-web/hosted-fields~field field objects} for each field. Used in {@link module:braintree-web/hosted-fields~create create}.
 */
export interface HostedFieldFieldOptions {
    cardholderName?: HostedFieldsField | undefined;
    cvv?: HostedFieldsField | undefined;
    expirationDate?: HostedFieldsField | undefined;
    expirationMonth?: HostedFieldsField | undefined;
    expirationYear?: HostedFieldsField | undefined;
    number?: HostedFieldsField | undefined;
    postalCode?: HostedFieldsField | undefined;
}

/**
 * @description The event payload sent from {@link HostedFields#on|on} when the `binAvailable` event is emitted.
 */
export interface HostedFieldsBinPayload {
    bin: string;
}

/**
 * @description Information about the card type, sent in {@link HostedFields~stateObject|stateObjects}.
 * - `american-express`
 * - `diners-club`
 * - `discover`
 * - `jcb`
 * - `maestro`
 * - `master-card`
 * - `unionpay`
 * - `visa`
 * - `American Express`
 * - `Diners Club`
 * - `Discover`
 * - `JCB`
 * - `Maestro`
 * - `MasterCard`
 * - `UnionPay`
 * - `Visa`
 * This object contains data relevant to the security code requirements of the card brand.
 * For example, on a Visa card there will be a <code>CVV</code> of 3 digits, whereas an
 * American Express card requires a 4-digit <code>CID</code>.
 */

export interface HostedFieldsCardCode {
    name: string;
    size: number;
}

export interface HostedFieldsHostedFieldsCard {
    type: string;
    niceType: string;
    code: HostedFieldsCardCode;
}

/**
 * @description Data about Hosted Fields fields, sent in {@link HostedFields~stateObject|stateObjects}.
 * A determination based on the future validity of the input value.
 * This is helpful when a user is entering a card number and types <code>"41"</code>.
 * While that value is not valid for submission, it is still possible for
 * it to become a fully qualified entry. However, if the user enters <code>"4x"</code>
 * it is clear that the card number can never become valid and isPotentiallyValid will
 * return false.
 */
export interface HostedFieldsHostedFieldsFieldData {
    container: HTMLElement;
    isFocused: boolean;
    isEmpty: boolean;
    isPotentiallyValid: boolean;
    isValid: boolean;
}

/**
 * @description The event payload sent from {@link HostedFields#on|on} or {@link HostedFields#getState|getState}.
 * This will return an array of potential {@link HostedFields~hostedFieldsCard|cards}. If the card type has been determined, the array will contain only one card.
 * Internally, Hosted Fields uses <a href="https://github.com/braintree/credit-card-type">credit-card-type</a>,
 * an open-source card detection library.
 * The name of the field associated with an event. This will not be included if returned by {@link HostedFields#getState|getState}. It will be one of the following strings:<br>
 * - `"number"`
 * - `"cvv"`
 * - `"expirationDate"`
 * - `"expirationMonth"`
 * - `"expirationYear"`
 * - `"postalCode"`
 */
export type HostedFieldsHostedFieldsFieldName =
    | "number"
    | "cvv"
    | "expirationDate"
    | "expirationMonth"
    | "expirationYear"
    | "postalCode"
    | "cardholderName";

export type HostedFieldsFieldDataFields = {
    [key in HostedFieldsHostedFieldsFieldName]: HostedFieldsHostedFieldsFieldData;
};

export interface HostedFieldsState {
    cards: HostedFieldsHostedFieldsCard[];
    fields: HostedFieldsFieldDataFields;
}

export interface HostedFieldsEvent extends HostedFieldsState {
    emittedBy: HostedFieldsHostedFieldsFieldName;
}

/**
 * @deprecated Turned into an alias. Use `HostedFieldsEvent` instead
 */
export type HostedFieldsStateObject = HostedFieldsEvent;

export interface HostedFieldsEventTypeMap {
    blur: HostedFieldsEvent;
    focus: HostedFieldsEvent;
    empty: HostedFieldsEvent;
    notEmpty: HostedFieldsEvent;
    cardTypeChange: HostedFieldsEvent;
    validityChange: HostedFieldsEvent;
    inputSubmitRequest: HostedFieldsEvent;
    binAvailable: HostedFieldsBinPayload;
}

export type HostedFieldEventType = keyof HostedFieldsEventTypeMap;

export interface HostedFieldsAccountDetails {
    bin: string;
    cardType: string;
    expirationMonth: string;
    expirationYear: string;
    cardholderName: string;
    lastTwo: string;
    lastFour: string;
}

export interface HostedFieldsTokenizePayload {
    nonce: string;
    details: HostedFieldsAccountDetails;
    type: string;
    description: string;
    /**
     * Provides details about regulatory environment.
     * See https://developer.paypal.com/braintree/docs/guides/3d-secure/migration/javascript/v3#authentication-insight.
     */
    authenticationInsight?: {
        regulationEnvironment?: "psd2" | "unregulated" | "unavailable";
    };
}

/**
 * @description The name of a HostedFields attribute.
 */
export type HostedFieldAttributeName = "aria-invalid" | "aria-required" | "disabled" | "placeholder";

/**
 * @description Fields used in setAttribute() and removeAttribute() for modifying a HostedFields instance's attributes.
 */
export interface HostedFieldAttributeOptions {
    field: HostedFieldsHostedFieldsFieldName;
    attribute: HostedFieldAttributeName;
    value?: string | boolean;
}

/**
 * @description Fields used in setMessage() for modifying a HostedFields instance's visually hidden message.
 */
export interface HostedFieldMessageOptions {
    field: HostedFieldsHostedFieldsFieldName;
    message: string;
}

export interface HostedFieldsBillingAddress {
    postalCode?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    company?: string | undefined;
    streetAddress?: string | undefined;
    extendedAddress?: string | undefined;
    locality?: string | undefined;
    region?: string | undefined;
    countryCodeNumeric?: string | undefined;
    countryCodeAlpha2?: string | undefined;
    countryCodeAlpha3?: string | undefined;
    countryName?: string | undefined;
}

export type TokenizationFields =
    | "number"
    | "cvv"
    | "expirationDate"
    | "expirationMonth"
    | "expirationYear"
    | "postalCode"
    | "cardholderName";

export interface HostedFields {
    /**
     * An object that represents CSS that will be applied in each hosted field. This object looks similar to CSS.
     * Typically, these styles involve fonts (such as `font-family` or `color`).
     *
     * These are the CSS properties that Hosted Fields supports. Any other CSS should be specified on your
     * page and outside of any Braintree configuration. Trying to set unsupported properties will fail and put
     * a warning in the console.
     *
     * Supported CSS properties are:
     * `color`
     * `font-family`
     * `font-size-adjust`
     * `font-size`
     * `font-stretch`
     * `font-style`
     * `font-variant-alternates`
     * `font-variant-caps`
     * `font-variant-east-asian`
     * `font-variant-ligatures`
     * `font-variant-numeric`
     * `font-variant`
     * `font-weight`
     * `font`
     * `letter-spacing`
     * `line-height`
     * `opacity`
     * `outline`
     * `text-shadow`
     * `transition`
     * `-moz-osx-font-smoothing`
     * `-moz-tap-highlight-color`
     * `-moz-transition`
     * `-webkit-font-smoothing`
     * `-webkit-tap-highlight-color`
     * `-webkit-transition`
     */
    styleOptions: any;

    on<EventType extends HostedFieldEventType>(
        event: EventType,
        handler: (event: HostedFieldsEventTypeMap[EventType]) => void,
    ): void;
    off<EventType extends HostedFieldEventType>(
        event: EventType,
        handler: (event: HostedFieldsEventTypeMap[EventType]) => void,
    ): void;

    teardown(): Promise<void>;
    teardown(callback?: callback): void;

    /**
     * Tokenizes fields and returns a nonce payload.     * @example <caption>Tokenize a card</caption>
     * hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
     *   if (tokenizeErr) {
     *     switch (tokenizeErr.code) {
     *       case 'HOSTED_FIELDS_FIELDS_EMPTY':
     *         console.error('All fields are empty! Please fill out the form.');
     *         break;
     *       case 'HOSTED_FIELDS_FIELDS_INVALID':
     *         console.error('Some fields are invalid:', tokenizeErr.details.invalidFieldKeys);
     *         break;
     *       case 'HOSTED_FIELDS_FAILED_TOKENIZATION':
     *         console.error('Tokenization failed server side. Is the card valid?');
     *         break;
     *       case 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR':
     *         console.error('Network error occurred when tokenizing.');
     *         break;
     *       default:
     *         console.error('Something bad happened!', tokenizeErr);
     *     }
     *   } else {
     *     console.log('Got nonce:', payload.nonce);
     *   }
     * });
     * @example <caption>Tokenize and vault a card</caption>
     * hostedFieldsInstance.tokenize({
     *   vault: true
     * }, function (tokenizeErr, payload) {
     *   if (tokenizeErr) {
     *     console.error(tokenizeErr);
     *   } else {
     *     console.log('Got nonce:', payload.nonce);
     *   }
     * });
     */
    tokenize(options?: {
        vault?: boolean | undefined;
        fieldsToTokenize?: Array<TokenizationFields> | undefined;
        cardholderName?: string | undefined;
        billingAddress?: HostedFieldsBillingAddress | undefined;
    }): Promise<HostedFieldsTokenizePayload>;
    tokenize(
        options: {
            vault?: boolean | undefined;
            fieldsToTokenize?: Array<TokenizationFields> | undefined;
            cardholderName?: string | undefined;
            billingAddress?: HostedFieldsBillingAddress | undefined;
        },
        callback: callback<HostedFieldsTokenizePayload>,
    ): void;
    tokenize(callback: callback<HostedFieldsTokenizePayload>): void;

    /**
     * Add a class to a {@link module:braintree-web/hosted-fields~field field}. Useful for updating field styles when events occur elsewhere in your checkout.     *
     * @example
     * hostedFieldsInstance.addClass('number', 'custom-class', function (addClassErr) {
     *   if (addClassErr) {
     *     console.error(addClassErr);
     *   }
     * });
     */
    addClass(field: string, classname: string, callback?: callback): void;

    /**
     * Removes a class to a {@link module:braintree-web/hosted-fields~field field}. Useful for updating field styles when events occur elsewhere in your checkout.     *
     * @example
     * hostedFieldsInstance.addClass('number', 'custom-class', function (addClassErr) {
     *   if (addClassErr) {
     *     console.error(addClassErr);
     *     return;
     *   }
     *
     *   // some time later...
     *   hostedFieldsInstance.removeClass('number', 'custom-class');
     * });
     */
    removeClass(field: string, classname: string, callback?: callback): void;

    /**
     * Sets the placeholder of a {@link module:braintree-web/hosted-fields~field field}.     *
     * @example
     * hostedFieldsInstance.setPlaceholder('number', '4111 1111 1111 1111', function (placeholderErr) {
     *   if (placeholderErr) {
     *     console.error(placeholderErr);
     *   }
     * });
     *
     * @example <caption>Update CVV field on card type change</caption>
     * hostedFieldsInstance.on('cardTypeChange', function (event) {
     *   // Update the placeholder value if there is only one possible card type
     *   if (event.cards.length === 1) {
     *     hostedFields.setPlaceholder('cvv', event.cards[0].code.name, function (placeholderErr) {
     *       if (placeholderErr) {
     *         // Handle errors, such as invalid field name
     *         console.error(placeholderErr);
     *       }
     *     });
     *   }
     * });
     */
    setPlaceholder(field: string, placeholder: string, callback?: callback): void;

    /**
     * @example
     * hostedFieldsInstance.clear('number', function (clearErr) {
     *   if (clearErr) {
     *     console.error(clearErr);
     *   }
     * });
     *
     * @example <caption>Clear several fields</caption>
     * hostedFieldsInstance.clear('number');
     * hostedFieldsInstance.clear('cvv');
     * hostedFieldsInstance.clear('expirationDate');
     */
    clear(field: string, callback?: callback): void;

    /**
     * Returns an {@link HostedFields~stateObject|object} that includes the state of all fields and possible card types.
     * @example <caption>Check if all fields are valid</caption>
     * var state = hostedFields.getState();
     *
     * var formValid = Object.keys(state.fields).every(function (key) {
     *   return state.fields[key].isValid;
     * });
     */
    getState(): HostedFieldsState;

    /**
     * Programmatically focus a {@link module:braintree-web/hosted-fields-field field}.     *
     * @example
     * hostedFieldsInstance.focus('number', function (focusErr) {
     *   if (focusErr) {
     *     console.error(focusErr);
     *   }
     * });
     */
    focus(field: HostedFieldsHostedFieldsFieldName, callback?: callback): void;

    /**
     * Sets an attribute of a {@link module:braintree-web/hosted-fields~field field}.
     * Supported attributes are `aria-invalid`, `aria-required`, `disabled`, and `placeholder`.
     *
     * @param options The options for the attribute you wish to set.
     * @param options.field The field to which you wish to add an attribute. Must be a valid {@link module:braintree-web/hosted-fields~fieldOptions fieldOption}.
     * @param options.attribute The name of the attribute you wish to add to the field.
     * @param options.value The value for the attribute.
     * @param callback Callback executed on completion, containing an error if one occurred. No data is returned if the attribute is set successfully.
     *
     * @example <caption>Set the placeholder attribute of a field</caption>
     * hostedFieldsInstance.setAttribute({
     *   field: 'number',
     *   attribute: 'placeholder',
     *   value: '1111 1111 1111 1111'
     * }, function (attributeErr) {
     *   if (attributeErr) {
     *     console.error(attributeErr);
     *   }
     * });
     *
     * @example <caption>Set the aria-required attribute of a field</caption>
     * hostedFieldsInstance.setAttribute({
     *   field: 'number',
     *   attribute: 'aria-required',
     *   value: true
     * }, function (attributeErr) {
     *   if (attributeErr) {
     *     console.error(attributeErr);
     *   }
     * });
     *
     * @returns Returns a promise if no callback is provided.
     */
    setAttribute(options: HostedFieldAttributeOptions, callback?: callback): void;

    /**
     * Removes a supported attribute from a {@link module:braintree-web/hosted-fields~field field}.
     *
     * @param options The options for the attribute you wish to remove.
     * @param options.field The field from which you wish to remove an attribute. Must be a valid {@link module:braintree-web/hosted-fields~fieldOptions fieldOption}.
     * @param options.attribute The name of the attribute you wish to remove from the field.
     * @param callback Callback executed on completion, containing an error if one occurred. No data is returned if the attribute is removed successfully.
     *
     * @example <caption>Remove the placeholder attribute of a field</caption>
     * hostedFieldsInstance.removeAttribute({
     *   field: 'number',
     *   attribute: 'placeholder'
     * }, function (attributeErr) {
     *   if (attributeErr) {
     *     console.error(attributeErr);
     *   }
     * });
     *
     * @returns Returns a promise if no callback is provided.
     */
    removeAttribute(options: HostedFieldAttributeOptions, callback?: callback): void;

    /**
     * Sets a visually hidden message (for screen readers) on a {@link module:braintree-web/hosted-fields~field field}.
     *
     * @param options The options for the attribute you wish to set.
     * @param options.field The field to which you wish to add an attribute. Must be a valid {@link module:braintree-web/hosted-fields~fieldOptions fieldOption}.
     * @param options.message The value for the attributeThe message to set.
     *
     * @example <caption>Set an error message on a field</caption>
     * hostedFieldsInstance.setMessage({
     *   field: 'number',
     *   message: 'Invalid card number'
     * });
     *
     * @example <caption>Remove the message on a field</caption>
     * hostedFieldsInstance.setMessage({
     *   field: 'number',
     *   message: ''
     * });
     */
    setMessage(options: HostedFieldMessageOptions): void;
}

/**
 * braintree.hostedFields.create({
 *   client: clientInstance,
 *   styles: {
 *     'input': {
 *       'font-size': '16pt',
 *       'color': '#3A3A3A'
 *     },
 *     '.number': {
 *       'font-family': 'monospace'
 *     },
 *     '.valid': {
 *       'color': 'green'
 *     }
 *   },
 *   fields: {
 *     number: {
 *       selector: '#card-number'
 *     },
 *     cvv: {
 *       selector: '#cvv'
 *     },
 *     expirationDate: {
 *       selector: '#expiration-date'
 *     }
 *   }
 * }, callback);
 */
export function create(options: {
    client?: Client | undefined;
    authorization?: string | undefined;
    fields: HostedFieldFieldOptions;
    styles?: any;
}): Promise<HostedFields>;
export function create(
    options: {
        client?: Client | undefined;
        authorization?: string | undefined;
        fields: HostedFieldFieldOptions;
        styles?: any;
    },
    callback: callback<HostedFields>,
): void;
