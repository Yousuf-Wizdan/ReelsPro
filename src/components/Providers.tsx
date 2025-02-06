"use client";
import { ImageKitProvider} from "imagekitio-next";
import { SessionProvider } from "next-auth/react";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit-auth");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    console.log(error)
    throw new Error(`Imagekit Authentication request failed`);
  }
};

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <SessionProvider>

      <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
        {children}
      </ImageKitProvider>

    </SessionProvider>

  );
}