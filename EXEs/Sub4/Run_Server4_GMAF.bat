
start /min "Window1" cmd.exe /k "D: && cd \Projects\Project_Sub_Servers\EXEs\Sub4 && RunCam0.bat && exit"
echo "RunCam0 started"
start /min "Window1" cmd.exe /k "D: && cd \Projects\Project_Sub_Servers\EXEs\Sub4 && p42_P2_middle.bat && exit"
echo "p42_P2_middle started"
start /min "Window1" cmd.exe /k "D: && cd \Projects\Project_Sub_Servers\EXEs\Sub4 && p43_P4_merge.bat && exit"
echo "p43_P4_merge started"