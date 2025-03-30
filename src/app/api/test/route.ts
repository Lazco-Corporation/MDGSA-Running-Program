import { HttpStatus } from "@/modules/http/statusCodes";
import { requestHandler } from "@/modules/requestHandler";

export const GET = requestHandler.withoutAuth(() => {
  return teapot();
});

function teapot() {
  const teapotAscii =
    " _   _      _ _         _\n| | | | ___| | | ___   | |\n| |_| |/ _ \\ | |/ _ \\  | |\n|  _  |  __/ | | (_) | |_|\n|_| |_|\\___|_|_|\\___/  (_)\n ___ _                                _         _                         _     _ \n|_ _( )_ __ ___     __ _    ___ _   _| |_ ___  | |_ ___  __ _ _ __   ___ | |_  | |\n | ||/| '_ ` _ \\   / _` |  / __| | | | __/ _ \\ | __/ _ \\/ _` | '_ \\ / _ \\| __| | |\n | |  | | | | | | | (_| | | (__| |_| | ||  __/ | ||  __/ (_| | |_) | (_) | |_  |_|\n|___| |_| |_| |_|  \\__,_|  \\___|\\__,_|\\__\\___|  \\__\\___|\\__,_| .__/ \\___/ \\__| (_)\n                                                             |_|\n\n\n                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤\n                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣘⣿⣿⣀⡀\n                        ⠀⠀⣀⣀⡀⠀⠀⠀⢀⣀⠘⠛⠛⠛⠛⠛⠛⠁⣀\n                        ⢠⡿⠋⠉⠛⠃⣠⣤⣈⣉⠻⠿⣿⣿⣿⣿⠿⠛⣉⣁⣤⣄⠀⠀⣾⣿⡿⠗\n                        ⢸⡇⠀⠀⠀⣰⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿⠿⣿⣿⣿⣿⣿⣆⠀⣿⣿\n                        ⢸⣇⠀⠀⠀⣿⣿⣿⣿⣿⡇⣿⢸⣿⣿⡇⣿⢸⣿⣿⣿⠟⣉⣠⣿⣿⡀\n                        ⠀⠙⠷⡆⠘⣿⣿⣿⣿⣿⣿⣶⣿⣿⣿⣿⣶⣿⣿⣿⡇⣾⣿⣿⣿⣿⡇\n                        ⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⡿⢿⣿⣿⡿⢿⣿⣿⣿⣇⢻⣿⣿⣿⠟\n                        ⠀⠀⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣶⣤⣤⣶⣿⣿⣿⣿⠿⠂⠉⠁\n                        ⠀⠀⠀⠀⠀⠀⠀⠀⢄⣉⠉⠛⠛⠛⠛⠛⠋⢉⣉⡠\n                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⠿⠿⠿⠿⠿⠿⠛⠋⠁\n";

  return new Response(teapotAscii, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
    status: HttpStatus.IM_A_TEAPOT,
    statusText: "I'm a teapot",
  });
}
