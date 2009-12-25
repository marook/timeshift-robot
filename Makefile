
all: build

build: target/_gadget/timesheet/timesheet.xml target/app.yaml

deploy: clean build
	../google_appengine/appcfg.py update target

clean:
	rm -rfv -- target

target:
	mkdir -- target

target/_gadget: target
	mkdir -- target/_gadget

target/_gadget/timesheet: target/_gadget
	mkdir -- target/_gadget/timesheet

target/_gadget/timesheet/timesheet.xml: target/_gadget/timesheet src/_gadget/timesheet/timesheet.xml src/_gadget/timesheet/timesheet.html
	replace '@@timesheet.js@@' "`cat src/_gadget/timesheet/timesheet.js`" '@@timesheet.html@@' "`cat src/_gadget/timesheet/timesheet.html`" < "src/_gadget/timesheet/timesheet.xml" > "$@"

target/app.yaml: src/app.yaml target
	cp -- src/app.yaml $@
