declare module "@vercel/blob" {
  export function put(
    pathname: string,
    body: string | Blob | ArrayBuffer | ReadableStream,
    options: {
      access: "private" | "public";
      addRandomSuffix?: boolean;
      allowOverwrite?: boolean;
      contentType?: string;
      token?: string;
    },
  ): Promise<unknown>;

  export function get(
    pathname: string,
    options: {
      access?: "private" | "public";
      token?: string;
    },
  ): Promise<{ blob: { downloadUrl: string } } | null>;
}
