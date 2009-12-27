#
# Copyright 2009 Markus Pielmeier
#
# This file is part of timesheet.
#
# timesheet is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# timesheet is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with timesheet.  If not, see <http://www.gnu.org/licenses/>.
#

all: build

build: target/_gadget/timesheet/timesheet.xml target/app.yaml

deploy: build
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

target/_gadget/timesheet/timesheet.xml: target/_gadget/timesheet src/_gadget/timesheet/timesheet.xml src/_gadget/timesheet/timesheet.html src/_gadget/timesheet/timesheet.css src/_gadget/timesheet/timesheet.js
	replace '@@timesheet.js@@' "`cat src/_gadget/timesheet/timesheet.js`" '@@timesheet.html@@' "`cat src/_gadget/timesheet/timesheet.html`" '@@timesheet.css@@' "`cat src/_gadget/timesheet/timesheet.css`" < "src/_gadget/timesheet/timesheet.xml" > "$@"

target/app.yaml: src/app.yaml target
	cp -- src/app.yaml "$@"

target-test:
	mkdir -- "$@"

target-test/_gadget: target-test
	mkdir -- "$@"

target-test/_gadget/timesheet: target-test/_gadget
	mkdir -- "$@"

target-test/_gadget/timesheet/timesheet-test.html: target-test/_gadget/timesheet test/_gadget/timesheet/timesheet-test.html
	replace '@@timesheet.html@@' "`cat src/_gadget/timesheet/timesheet.html`" < "test/_gadget/timesheet/timesheet-test.html" > "$@"
