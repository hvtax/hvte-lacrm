// ==UserScript==
// @name        HVTE Extensions for LACRM
// @namespace   http://tampermonkey.net/
// @version     1.7
// @description Adds a context menu to LACRM contact pages to provid3e additional functions.
// @author      Thomas Bridgman (tom@hvtaxexperts.com)
// @match       https://account.lessannoyingcrm.com/app/View_Contact*
// @grant       none
// @updateURL   https://raw.githubusercontent.com/hvtax/hvte-lacrm/refs/heads/main/hvte-lacrm.js
// @downloadURL https://raw.githubusercontent.com/hvtax/hvte-lacrm/refs/heads/main/hvte-lacrm.js
// ==/UserScript==

(function() {
    'use strict';

    let currentContactId = null;
    let button = null;
    let menu = null;

    // Define menu items
    const menuItems = [
        {
            name: 'Invoice',
            urlTemplate: function(contactId) {
                return `https://www.cognitoforms.com/HudsonValleyTaxExperts1/InvoiceForServices2024?entry={'TargetID':'${contactId}'}`;
            }
        },
        {
            name: 'Payment',
            urlTemplate: function(contactId) {
                return `https://www.cognitoforms.com/HudsonValleyTaxExperts1/ClientPayment2?entry={'LACRMContact':'${contactId}'}`;
            }
        }
        // Add more menu items here
    ];

    // Function to create the HVTE button
    function createButton(contactId) {
        // If the button already exists, remove it
        if (button) {
            button.remove();
        }

        // Create the button element
        button = document.createElement('button');
        button.innerText = 'HVTE';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';

        // Create the context menu
        button.onclick = function() {
            if (menu) {
                menu.remove();
                menu = null;
            } else {
                createContextMenu(contactId);
            }
        };

        // Add the button to the page
        document.body.appendChild(button);
    }

    // Helper function to create a menu option
    function createMenuOption(item, contactId) {
        const option = document.createElement('div');
        option.innerText = item.name;
        option.style.padding = '8px 16px';
        option.style.cursor = 'pointer';
        option.style.backgroundColor = '#f1f1f1';
        option.onmouseover = function() {
            option.style.backgroundColor = '#ddd';
        };
        option.onmouseout = function() {
            option.style.backgroundColor = '#f1f1f1';
        };
        option.onclick = function() {
            const url = item.urlTemplate(contactId);
            window.open(url, '_blank');
            // Close the menu
            if (menu) {
                menu.remove();
                menu = null;
            }
        };
        return option;
    }

    // Function to create the context menu
    function createContextMenu(contactId) {
        menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '40px';
        menu.style.right = '10px';
        menu.style.backgroundColor = 'white';
        menu.style.border = '1px solid #ccc';
        menu.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, 0.1)';
        menu.style.zIndex = '1000';
        menu.style.padding = '5px 0';

        // Create menu items
        menuItems.forEach(function(item) {
            const option = createMenuOption(item, contactId);
            menu.appendChild(option);
        });

        // Add the menu to the page
        document.body.appendChild(menu);

        // Close the menu when clicking elsewhere
        document.addEventListener('click', function(event) {
            if (!menu.contains(event.target) && event.target !== button) {
                if (menu) {
                    menu.remove();
                    menu = null;
                }
            }
        });
    }

    // Function to check the URL and update the button
    function checkForContactPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const contactId = urlParams.get('ContactId');

        if (contactId && contactId !== currentContactId) {
            // If on a contact page and the contactId is different, update the button
            currentContactId = contactId;
            createButton(contactId);
        } else if (!contactId && button) {
            // If not on a contact page, remove the button and menu
            button.remove();
            button = null;
            currentContactId = null;

            if (menu) {
                menu.remove();
                menu = null;
            }
        }
    }

    // Monitor URL changes (this handles SPA behavior and navigation within the app)
    setInterval(checkForContactPage, 1000);

})();
