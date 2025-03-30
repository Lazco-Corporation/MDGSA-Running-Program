import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";

export async function GET() {
  try {
    const teapotAscii =
      " _   _      _ _         _\n| | | | ___| | | ___   | |\n| |_| |/ _ \\ | |/ _ \\  | |\n|  _  |  __/ | | (_) | |_|\n|_| |_|\\___|_|_|\\___/  (_)\n ___ _                                _         _                         _     _ \n|_ _( )_ __ ___     __ _    ___ _   _| |_ ___  | |_ ___  __ _ _ __   ___ | |_  | |\n | ||/| '_ ` _ \\   / _` |  / __| | | | __/ _ \\ | __/ _ \\/ _` | '_ \\ / _ \\| __| | |\n | |  | | | | | | | (_| | | (__| |_| | ||  __/ | ||  __/ (_| | |_) | (_) | |_  |_|\n|___| |_| |_| |_|  \\__,_|  \\___|\\__,_|\\__\\___|  \\__\\___|\\__,_| .__/ \\___/ \\__| (_)\n                                                             |_|\n\n\n                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤\n                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣘⣿⣿⣀⡀\n                        ⠀⠀⣀⣀⡀⠀⠀⠀⢀⣀⠘⠛⠛⠛⠛⠛⠛⠁⣀\n                        ⢠⡿⠋⠉⠛⠃⣠⣤⣈⣉⠻⠿⣿⣿⣿⣿⠿⠛⣉⣁⣤⣄⠀⠀⣾⣿⡿⠗\n                        ⢸⡇⠀⠀⠀⣰⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿⠿⣿⣿⣿⣿⣿⣆⠀⣿⣿\n                        ⢸⣇⠀⠀⠀⣿⣿⣿⣿⣿⡇⣿⢸⣿⣿⡇⣿⢸⣿⣿⣿⠟⣉⣠⣿⣿⡀\n                        ⠀⠙⠷⡆⠘⣿⣿⣿⣿⣿⣿⣶⣿⣿⣿⣿⣶⣿⣿⣿⡇⣾⣿⣿⣿⣿⡇\n                        ⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⡿⢿⣿⣿⡿⢿⣿⣿⣿⣇⢻⣿⣿⣿⠟\n                        ⠀⠀⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣶⣤⣤⣶⣿⣿⣿⣿⠿⠂⠉⠁\n                        ⠀⠀⠀⠀⠀⠀⠀⠀⢄⣉⠉⠛⠛⠛⠛⠛⠋⢉⣉⡠\n                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⠿⠿⠿⠿⠿⠿⠛⠋⠁\n";

    return new Response(teapotAscii, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
      status: HttpStatus.IM_A_TEAPOT,
      statusText: "I'm a teapot",
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return NextResponse.json(error.payload, { status: error.code || 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
