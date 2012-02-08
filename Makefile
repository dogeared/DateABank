file=*.test.js
files=`find test/unit -name '$(file)' -type f -print0 | xargs -0 echo`

default: all

all: unit peanut

unit:
	@NODE_PATH=test:lib expresso -t 250 -I test -I lib -s $(files)

peanut:
	@peanut -s

.PHONY: unit peanut
