# ChromeRequestCountPlugin

This is a chrome plugin load at runtime of selenium webdriver to find out outstanding server requests and wait till the requests to complete before performing the each webdriver steps.

Usage to code inside the webdriver

                       new WebDriverWait(DriverManager.getDriver(), 10)
			  .until(new ExpectedCondition<Boolean>() {
				public Boolean apply(WebDriver input) {
					((JavascriptExecutor) input)
					.executeScript("var outReqCount = null;");
					
					((JavascriptExecutor) input)
					.executeScript("chrome.runtime.sendMessage(\"napdgepbhppjjoggpeaokohmmajddimk\",{ input: \"getTab\" }, function (response) { outReqCount = response.keys });");
					return true;
				}

			});
			new WebDriverWait(DriverManager.getDriver(), 60)
					.until(new ExpectedCondition<Boolean>() {

						public Boolean apply(WebDriver input) {
							((JavascriptExecutor) input)
							.executeScript("document.dispatchEvent(new Event('send'))");
							System.out.println(((JavascriptExecutor) input).executeScript("return localStorage.getItem(outReqCount)"));
							return ( ((JavascriptExecutor) input).executeScript("return localStorage.getItem(outReqCount)") != null && Integer.valueOf((String) ((JavascriptExecutor) input).executeScript("return localStorage.getItem(outReqCount)")) == 0);
						}

					});
