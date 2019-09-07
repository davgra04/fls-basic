#!/usr/bin/env python3

import time
from selenium import webdriver

url = "file:///Users/devgru/code/fls/fls-basic/fls.html"

browser = webdriver.Firefox()
browser.get(url)
time.sleep(3)   # give browser a chance to execute javascript
browser.save_screenshot("test.png")
