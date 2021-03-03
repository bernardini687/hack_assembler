// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/06/add/Add.asm

// Computes R0 = 5 + 2  (R0 refers to RAM[0])

@ 5   // 0000 0000 0000 0101
D=A   // 1110 1100 0001 0000
@2    // 0000 0000 0000 0010
D=D+A // 1110 0000 1001 0000
@0    // 0000 0000 0000 0000
M = D // 1110 0011 0000 1000
