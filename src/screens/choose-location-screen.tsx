import React from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Autocomplete,
} from "@mui/material";
import qs from "qs";
import Logo from "../components/logo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import OffliButton from "../components/offli-button";
import LabeledDivider from "../components/labeled-divider";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  getAuthToken,
  setAuthToken,
  setRefreshToken,
} from "../utils/token.util";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { useNavigate } from "react-router-dom";
import { DEFAULT_KEYCLOAK_URL } from "../assets/config";
import { loginUser } from "../api/auth/requests";
import { useDebounce } from "use-debounce";
import { getLocationFromQuery } from "../api/activities/requests";

export interface FormValues {
  placeQuery: string;
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    placeQuery: yup.string().defined().required(),
  });

const ChooseLocationScreen: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { setUserInfo, setStateToken } = React.useContext(
    AuthenticationContext
  );
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      placeQuery: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const [queryString] = useDebounce(watch("placeQuery"), 1000);

  const placeQuery = useQuery(
    ["locations", queryString],
    (props) => getLocationFromQuery(queryString),
    {
      enabled: !!queryString,
    }
  );
  //   const { isLoading, mutate } = useMutation(
  //     ["login"],
  //     (formValues: FormValues) => {
  //       //keycloak login that we are using no more
  //       // const data = {
  //       //   ...formValues,
  //       //   grant_type: 'password',
  //       //   client_id: 'UserManagement',
  //       // }
  //       // const options = {
  //       //   method: 'POST',
  //       //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
  //       //   data: qs.stringify(data),
  //       //   url: `${DEFAULT_KEYCLOAK_URL}/realms/Offli/protocol/openid-connect/token`,
  //       // }
  //       return loginUser(formValues);
  //     },
  //     {
  //       onSuccess: (data, params) => {
  //         console.log(data?.data);
  //         // setAuthToken(data?.data?.access_token)
  //         // setRefreshToken(data?.data?.refresh_token)
  //         setStateToken(data?.data?.token?.access_token ?? null);
  //         !!setUserInfo && setUserInfo({ username: params?.username });
  //         localStorage.setItem("username", params?.username);
  //         navigate(ApplicationLocations.ACTIVITIES);
  //       },
  //       onError: (error) => {
  //         enqueueSnackbar("Failed to log in", { variant: "error" });
  //       },
  //     }
  //   );

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => console.log(values),
    []
  );

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
      // className="backgroundImage"
    >
      <Logo />

      <Controller
        name="placeQuery"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            options={placeQuery?.data?.data ?? []}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
            loading={placeQuery?.isLoading}
            // isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, locationObject) =>
              field.onChange({
                name: locationObject?.display_name,
                coordinates: {
                  lat: locationObject?.lat,
                  lon: locationObject?.lon,
                },
              })
            }
            getOptionLabel={(option) => option?.display_name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search place"
                onChange={(e) => setValue("placeQuery", e.target.value)}
              />
            )}
          />
        )}
      />
      <OffliButton
        sx={{ width: "80%", mb: 5 }}
        type="submit"
        // isLoading={isLoading}
      >
        Login
      </OffliButton>
    </form>
  );
};

export default ChooseLocationScreen;
