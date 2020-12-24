start = luggageRule

luggageRule = bagType:bagType ' contain ' conditions:conditionsList '.'
  { return { bagType, conditions } }

conditionsList
  = 'no other bags' { return []; }
  / firstCondition:condition ', ' restOfConditions:conditionsList { return [firstCondition, ...restOfConditions] }
  / condition:condition { return [condition]; }

condition = expectedNumber:integer ' ' bagType:bagType
  { return { expectedNumber, bagType } }

bagType = adjective:bagAdjective ' ' color:bagColor ' bag' 's'?
  { return { adjective, color }; }

bagAdjective = $ [a-z]+

bagColor = $ [a-z]+

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
