
start /min "Window1" cmd.exe /k "D: && cd \Projects\Project_Sub_Servers\EXEs\Sub2 && RunCam1.bat && exit"
echo "RunCam1 started"
start /min "Window1" cmd.exe /k "D: && cd \Projects\Project_Sub_Servers\EXEs\Sub2 && Run_Scene2.bat && exit"
echo "Run_Scene2 started"