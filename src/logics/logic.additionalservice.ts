import { createLogic } from 'redux-logic';
import { BOOK_ADDITIONAL_SERVICE, TBookAdditionalService } from '../types/action.additionalservice';
import { IDependencies, IAdditionalServiceResponse, IAdditionalServiceList } from '../types/responseApi';
import { GET_ADDITIONAL_SERVICES_LIST, BOOK_ADDITIONAL_SERVICES } from '../constants/api';
import { AxiosResponse } from 'axios';
import {
    bookAdditionalServiceSuccess,
    bookAdditioalServiceFailed,
} from '../actions/action.additionalservices';
import { handleError, IRulesFormValidation, handleFormValidation, toast } from '../utils/handleLogic';
import { printUrl } from '../utils/formating';
import moment from 'moment';
import { format } from 'date-fns';
import { AdditionalServiceList } from '../types/additionalservice';

const bookAdditionalServiceLogic = createLogic({
    type: BOOK_ADDITIONAL_SERVICE,
    validate({ action, getState }: IDependencies<ReturnType<TBookAdditionalService>>, allow, reject) {
        console.log('action==========>', action);
        if (action.payload?.data?.additional_services?.length <= 0) {
            toast('At least select one service');
            if (action.payload.onFailed) {
                action.payload.onFailed();
            }
            return reject(bookAdditioalServiceFailed('At least select one service', action.type));
        }

        return allow(action);
    },
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<TBookAdditionalService>>,
        dispatch,
        done,
    ) {
        const {
            data,
            // paymentType,
            // currency,
            // cvv,
            // expiryDate,
            // cardNumber,
            // holderName,
            // date,
            // time,
            // additional_services,
            // tip,
            // vip_note,
            // cardSave,
        } = action.payload;
        console.log('BOOK_ADDITIONAL_SERVICES', action.payload);
        httpClient
            .post(
                printUrl(BOOK_ADDITIONAL_SERVICES, ''),
                {
                    additional_services: data.additional_services,
                    current_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    reservation_date: `${format(data.date, 'YYYY-MM-DD')} ${format(data.time, 'HH:mm:ss')}`,
                    tip: data.tip,
                    vip_note: data.vip_note,
                    currency: data.currency,
                    card_number: data.cardNumber,
                    card_expiry: data.expiryDate,
                    card_cvv_number: data.cvv,
                    cardholder_name: data.holderName,
                    is_card_save: data.cardSave,
                    type: data.paymentType,
                },
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${getState().account.checkin_token}`,
                        // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                    },
                },
            )
            .then((response: AxiosResponse) => {
                //<IAdditionalServiceResponse>

                console.log(response, 'order room service food');
                return response.data;
            })
            .then((res) => {
                if (res?.message == 'Your card number is incorrect.') {
                    toast(res?.message);
                    if (action.payload.onFailed) {
                        action.payload.onFailed();
                    }
                } else {
                    dispatch(bookAdditionalServiceSuccess());

                    if (action.payload.onSuccess) {
                        action.payload.onSuccess();
                    }
                }
            })
            .catch((error) => {
                console.log('ERRORXX', error);
                handleError({
                    error,
                    dispatch,
                    failedAction: bookAdditioalServiceFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

export default [bookAdditionalServiceLogic];
