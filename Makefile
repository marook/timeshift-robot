
all: build

build: target/_gadget/timesheet/timesheet.xml target/app.yaml

deploy: clean build
	../google_appengine/appcfg.py update target

test: test-build
	$(BROWSER) "target-test/_gadget/timesheet/timesheet-test.html"

test-build: target-test/_gadget/timesheet/timesheet-test.html

clean:
	rm -rfv -- "target" "target-test"

target:
	mkdir -- "$@"

target/_gadget: target
	mkdir -- "$@"

target/_gadget/timesheet: target/_gadget
	mkdir -- "$@"

target/_gadget/timesheet/timesheet.xml: target/_gadget/timesheet src/_gadget/timesheet/timesheet.xml src/_gadget/timesheet/timesheet.html
	replace '@@timesheet.js@@' "`cat src/_gadget/timesheet/timesheet.js`" '@@timesheet.html@@' "`cat src/_gadget/timesheet/timesheet.html`" < "src/_gadget/timesheet/timesheet.xml" > "$@"

target/app.yaml: src/app.yaml target
	cp -- src/app.yaml $@

target-test:
	mkdir -- "$@"

target-test/_gadget: target-test
	mkdir -- "$@"

target-test/_gadget/timesheet: target-test/_gadget
	mkdir -- "$@"

target-test/_gadget/timesheet/timesheet-test.html: target-test/_gadget/timesheet test/_gadget/timesheet/timesheet-test.html
	replace '@@timesheet.html@@' "`cat src/_gadget/timesheet/timesheet.html`" < "test/_gadget/timesheet/timesheet-test.html" > "$@"
