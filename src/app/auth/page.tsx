"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/config/theme/theme";
import { Box, Stack, Typography, Button } from "@mui/material";
import Image from "next/image";
import googleSvg from "@/assets/oauth/google.svg";

function AuthContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/workspace";
  const errorParam = searchParams.get("error");

  const errorMessage = (() => {
    if (errorParam === "AccessDenied") return "Sign in was cancelled.";
    if (errorParam === "OAuthAccountNotLinked")
      return "This email is already linked to another sign-in method.";
    if (errorParam)
      return "An error occurred during sign in. Please try again.";
    return null;
  })();

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };
  const gridSize = 40;

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        backgroundImage: `url(/assets/tile.png)`,
        backgroundRepeat: "repeat",
        backgroundSize: `${gridSize}px ${gridSize}px`,
        p: 2,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Top-left logo */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "0.08em",
          color: "text.primary",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        CARREL
      </Typography>

      {/* Centered form */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Stack
          spacing={2.5}
          sx={{
            width: "100%",
            maxWidth: 400,
            alignItems: "flex-start",
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h2" sx={{ color: "text.primary", mb: 0 }}>
              Welcome to Carrel
            </Typography>

            <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
              Sign in or create an account to continue.
            </Typography>
          </Stack>

          {errorMessage && (
            <Typography variant="body2" sx={{ color: "error.main" }}>
              {errorMessage}
            </Typography>
          )}

          <Button
            fullWidth
            onClick={handleGoogleSignIn}
            startIcon={
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  width: 18,
                  height: 18,
                }}
              >
                <Image
                  src={googleSvg}
                  alt="Google"
                  width={18}
                  height={18}
                />
              </Box>
            }
            sx={{
              height: 52,
              borderRadius: 0.5,
              bgcolor: "background.default",
              color: "text.primary",
              textTransform: "none",
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 400,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
              transition: "none",
              "&:hover": {
                bgcolor: "grey.50",
                borderColor: "grey.400",
                boxShadow: "none",
              },
            }}
          >
            Continue with Google
          </Button>

          <Typography
            variant="subtitle2"
            sx={{ color: "text.disabled", pt: 1 }}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Stack>
      </Box>

      {/* Spacer to keep logo vertically balanced */}
      <Box aria-hidden sx={{ height: 28, flexShrink: 0 }} />
    </Box>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}
