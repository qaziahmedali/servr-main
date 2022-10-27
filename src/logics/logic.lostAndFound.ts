import { createLogic } from 'redux-logic';
import { IDependencies, ISuccessLostAndFound } from '../types/responseApi';
import { POST_LOST_AND_FOUND_API } from '../constants/api';
import { AxiosResponse } from 'axios';
import {
    handleError,
    IRulesFormValidation,
    handleFormValidation,
    validateEmail,
    validateName,
    validatePhoneNumber,
    toast,
} from '../utils/handleLogic';
import { Alert } from 'react-native';
import {
    POST_LOST_AND_FOUND,
    LOST_AND_FOUND_FAILED,
    LOST_AND_FOUND_SUCCESS,
    postLostAndFoundRequest,
    postLostAndFoundRequestFailed,
    postLostAndFoundRequestSuccess,
} from '../actions/action.lostAndFound';

const postLostAndFound = createLogic({
    type: POST_LOST_AND_FOUND,
    validate({ action, getState }: IDependencies<ReturnType<typeof postLostAndFoundRequest>>, allow, reject) {
        const { name, phonenumber, email, message } = action.payload.body;
        const rules: IRulesFormValidation[] = [
            {
                isValid: name.length > 1,
                message: getState().language.name_must_be_atleast_two_characters,
            },
            {
                isValid: phonenumber.length > 7,
                message: getState().language.phone_number_must_be_atleast_seven_digits,
            },
            {
                isValid: validatePhoneNumber(phonenumber),
                message: getState().language.phone_number_should_consist_of_numbers_only,
            },
            {
                isValid: validateEmail(email),
                message: getState().language.please_enter_a_valid_email,
            },
            {
                isValid: message !== '',
                message: getState().language.message_cannot_be_empty,
            },
        ];

        handleFormValidation(
            rules,
            () => allow(action),
            (rule) => {
                toast(rule.message);
                if (action.payload.onFailed) {
                    action.payload.onFailed();
                }
                reject(postLostAndFoundRequestFailed(rule.message, action.type));
            },
        );
    },
    process(
        { httpClient, getState, action }: IDependencies<ReturnType<typeof postLostAndFoundRequest>>,
        dispatch,
        done,
    ) {
        const { hotel_id, name, phonenumber, email, message } = action.payload.body;
        const form = new FormData();
        form.append('hotel_id', hotel_id),
            form.append('name', name),
            form.append('phone_number', phonenumber),
            form.append('email', email);
        form.append('description', message);
        httpClient
            .post(POST_LOST_AND_FOUND_API, form, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getState().account.access_token}`,
                    // Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuc2VydnJob3RlbGNsaWVudGRlbW8udGtcL1wvYm9va2luZ3MiLCJpYXQiOjE1ODMyNDA3NTMsImV4cCI6MTU4MzQ1Mjc5OSwibmJmIjoxNTgzMjQwNzUzLCJqdGkiOiJsZ0JiNWNGT1FMWnpuOVVIIiwic3ViIjoxMTIsInBydiI6IjI4ZDBjNTc2NGQ2MTQzMjcxNGFlOTBmM2I1Yjg0NmFiZmJiOGRiNDMifQ.RejBO9P1tGl--1JNcZLMFAg4YR0qYhLrG9HLCv0GdkY",
                },
            })
            .then((response: AxiosResponse<ISuccessLostAndFound>) => {
                if (__DEV__) {
                    console.log(`${action.type}: `, response);
                }
                if (action.payload.onSuccess) {
                    action.payload.onSuccess();
                }
                return response.data;
            })
            .then((response) => {
                // Alert.alert('success', `${response.success}`)
                if (response.success) {
                    dispatch(postLostAndFoundRequestSuccess(response));
                  //  toast('Your query has been sent successfully to hotel management');
                } else {
                    toast(response.message);
                }

                // else{
                //     alert(response.message)
                // }
            })
            .catch((error) => {
                handleError({
                    error,
                    dispatch,
                    failedAction: postLostAndFoundRequestFailed(error, action.type),
                    type: action.type,
                    onFailed: action.payload.onFailed,
                });
            })
            .then(() => done());
    },
});

export default [postLostAndFound];
