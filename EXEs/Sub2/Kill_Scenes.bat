@REM start cmd /k "D: && cd \"

start /min "Window1" cmd.exe /k "taskkill /F /IM FiniteLoop_Scene1.exe && exit"
start /min "Window1" cmd.exe /k "taskkill /F /IM FiniteLoop_Scene2.exe && exit"

@REM 웹캠 8060
@REM P3D 8072
@REM 메인 프로그램 8074
@REM 메인 프로그램2 8075