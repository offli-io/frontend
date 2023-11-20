import { Box } from "@mui/material";
import Logo from "../components/logo";
import OffliButton from "../components/offli-button";
import { useNavigate } from "react-router-dom";
import { ApplicationLocations } from "types/common/applications-locations.dto";
import backgroundImage from "../assets/img/undraw_real_life_blue.svg";

const LoginOrRegisterScreen = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //   justifyContent: 'center',
      }}
    >
      <Box sx={{ mt: 10, flex: 1 }}>
        <Logo />
      </Box>
      <img
        src={backgroundImage}
        alt="Background"
        style={{ height: "25%", marginBottom: "30%" }}
      />
      <OffliButton
        onClick={() => navigate(ApplicationLocations.LOGIN)}
        sx={{ width: "80%", mb: 1 }}
      >
        Login
      </OffliButton>
      <OffliButton
        onClick={() => navigate(ApplicationLocations.REGISTER)}
        variant="text"
        sx={{ width: "80%", mb: 3 }}
      >
        Register
      </OffliButton>
    </Box>
  );
};

export default LoginOrRegisterScreen;
