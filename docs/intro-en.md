# Introduction to petri nets
A net is a Tripel N = (S,T,F) where:
- S is a finite set of places, which represent the state of a system;
- T is a finite set of transitions, which represent events or actions that can occur in the system;
- F is a finite set of arcs connecting places and transitions, which represent the flow of tokens between places and transitions.

A token is a discrete unit of information that can be placed in a place and moved through the net.

The movement of token between the places is called firing. The firing process of elementary single-tokened nets includes the following steps:
1. Initialize the initial marking of the net by placing tokens in the appropriate places.
2. Choose a transition that is enabled, meaning all its input places have at least one token.
3. Fire the chosen transition by removing one token from each input place and placing one token in each output place.
4. Repeat steps 2 and 3 until no more transitions are enabled.
