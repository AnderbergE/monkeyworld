Ladder Games
============

Here is the overall structure fo the Ladder Games described. This includes the
Tree Game and the Mountain Game.

Event Order
-----------

1. start
  1. _introduceAgent_ | _startAgent_
  2. _placeTarget_
  3. readyToPick
  4. [ _allowInterrupt_ ]
  5. _picked_
      1. _approachLadder_
         1. [ agentTooLow | agentTooHigh ] | [ tooLow | tooHigh ]
         2. [ betterBecauseSmaller | betterBecauseBigger | hmm ]
      2. _getTarget_
         1. _resetScene_
         2. hasTarget
      3. _confirmTarget_
         1. **GOTO: 1.2** | cheer
   6. disallowInterrupt
      1. [ interrupt ]
         1. _resetScene_
         2. **GOTO: 1.2**
   7. _resetScene_

