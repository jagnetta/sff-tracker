// User info collection JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!checkAuthentication()) {
        return;
    }
    
    const userInfoForm = document.getElementById('userInfoForm');
    const unitSelect = document.getElementById('unit');
    const otherUnitGroup = document.getElementById('otherUnitGroup');
    const otherUnitInput = document.getElementById('otherUnit');
    const errorMessage = document.getElementById('errorMessage');
    
    // Show/hide "Other" unit input field
    unitSelect.addEventListener('change', function() {
        if (this.value === 'Other') {
            otherUnitGroup.style.display = 'block';
            otherUnitInput.required = true;
        } else {
            otherUnitGroup.style.display = 'none';
            otherUnitInput.required = false;
            otherUnitInput.value = '';
        }
    });
    
    // Handle form submission
    userInfoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const lastName = document.getElementById('lastName').value.trim();
        const selectedUnit = unitSelect.value;
        const otherUnit = otherUnitInput.value.trim();
        
        // Validate input
        if (!lastName) {
            showError('Please enter your last name.');
            return;
        }
        
        if (!selectedUnit) {
            showError('Please select your unit.');
            return;
        }
        
        if (selectedUnit === 'Other' && !otherUnit) {
            showError('Please specify your unit.');
            return;
        }
        
        // Store user information
        const userInfo = {
            lastName: lastName,
            unit: selectedUnit === 'Other' ? otherUnit : selectedUnit,
            timestamp: new Date().toISOString()
        };
        
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // Redirect to route selection
        window.location.href = 'home.html';
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Clear error after 5 seconds
        setTimeout(function() {
            errorMessage.style.display = 'none';
        }, 5000);
    }
});