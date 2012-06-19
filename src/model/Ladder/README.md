Ladder Games
============

Here is the overall structure fo the Ladder Games described. This includes the
Tree Game and the Mountain Game.

Event Order
-----------

1. start
  1. introduceAgent | startAgent
  2. placeTarget
  3. readyToPick
  4. picked
      1. approachLadder
         1. [ agentTooLow | agentTooHigh ] | [ tooLow | tooHigh ]
         2. [ betterBecauseSmaller | betterBecauseBigger | hmm ]
      2. getTarget
         1. resetScene
         2. hasTarget
      3. confirmTarget
         1. GOTO: 1.2 | cheer
   5. [ interrupt ]
      1. resetScene
      2. GOTO: 1.2
   6. resetScene

