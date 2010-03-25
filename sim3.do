vsim work.Lab_2
add wave ledr(17:0) state key(3) key(1) key(0) NewClock p1_score p2_score

# Simulation 2:
# Player 1 serves, Player 2 returns
# After that, Player 2 serves repeatedly until game ends, then reset
# Final Score: (7-0 for player 2)

# Set Game Clock - rising edges occur at (20x + 10) ns where x is any non-negative integer
force NewClock 0 0ns, 1 10ns -repeat 20ns

###############
## SERVICE 1 ##
###############
# Player 1 Serves
force key(3) 1 0ns, 0 45ns, 1 55ns
# Player 2 Returns
force key(1) 1 0ns, 0 385ns, 1 395ns
# Player 1 Swings Late
force key(3) 0 745ns, 1 755ns
# Score 0-1

###############
## SERVICE 2 ##
###############
# Player 2 Serves
force key(1) 0 805ns, 1 815ns 
# Player 1 Returns
force key(3) 0 1145ns, 1 1155ns
# Player 2 Swings Early
force key(1) 0 1445ns, 1 1455ns
# Score 1-1

###############
## SERVICE 3 ##
###############
# Player 1 Serves
force key(3) 0 1505ns, 1 1515ns
# Player 2 Swings Late
force key(1) 0 1885ns, 1 1895ns
# Score 2-1

###############
## SERVICE 4 ##
###############
# Player 1 Serves
force key(3) 0 1945ns, 1 1955ns
# Player 2 Doesn't Swing (Miss occurs at 2285ns)
# Score 3-1

###############
## SERVICE 5 ##
###############
# Player 1 Serves
force key(3) 0 2345ns, 1 2355ns
# Player 2 Returns
force key(1) 0 2685ns, 1 2695ns
# Player 1 Doesn't Swing (Miss occurs at 3025ns)
# Score 3-2

###############
## SERVICE 6 ##
###############
# Player 2 Serves
force key(1) 0 3105ns, 1 3115ns
# Player 1 Swings Early
force key(3) 0 3305ns, 1 3315ns
# Score 3-3 

###############
## SERVICE 7 ##
###############
# Player 2 Serves
force key(1) 0 3405ns, 1 3415ns
# Player 1 Returns
force key(3) 0 3745ns, 1 3755ns
# Player 2 Returns
force key(1) 0 4085ns, 1 4095ns
# Player 1 Returns
force key(3) 0 4425ns, 1 4435ns
# Player 2 Swings Early
force key(1) 0 4705ns, 1 4715ns
# Score 4-3

# Game is Reset
force key(0) 1 0ns, 0 4805ns, 1 4815ns

run 5000ns

