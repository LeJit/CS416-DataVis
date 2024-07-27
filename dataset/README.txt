Climbers 2021 dataset

File `metadata.txt` contains metadata in a form:

id_run;id_climber;date;run_number;URL;start;end;time_sec;time_frames;finished;side

Labels:

id_run - {id_climber}_{date}_{run_number}
id_climber - each climber is assigned a unique number, the mapping is available in `climbers.txt`
date - date of the event from which the run was taken
run_number - ordinal number of the run within the event, 1 - 4
URL - URL of the event
start/end - start/end of the run in seconds in the corresponding video
time_sec - official time, three decimal digits
time_frames - number of frames
finished - 0 = not finished, 1 = finished
side - side of the wall from the camera view, l = left, r = right



Directory `skeletons` contains 2D skeletons with 16 joints for every run in a form:

frame_number#j1_x,j1_y;...;j16_x,j16_y

where jk_x,jk_y are x and y coordinates of k-th joint