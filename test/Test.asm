// test comment
    @i
    M=1   // i = 1
    @sum
    M=0   // sum = 0

(LOOP)
    @i    // if i>RAM[0] goto init.stop
    D=M
    @R0
    D=D-M
    @init.stop
    D;JGT
    @i    // sum += 1
    D=M
    @sum
    M=D+M
    @i    // i++
    M=M+1
    @LOOP // goto LOOP
    0;JMP
(init.stop)
    @sum
    D=M
    @R1
    M=D   // RAM[1] = the sum
(END)
    @END
    0;JMP
