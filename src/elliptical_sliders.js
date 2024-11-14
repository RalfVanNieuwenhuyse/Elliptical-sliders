class EllipticalSlider {
    constructor(targetDiv, id, options) {
        this.targetDiv = targetDiv;
        this.id = id;
        this.options = options;
        this.currentValue = options.initialValue || 0;  // Track the current value
        this.sliderHandle = null;
        this.sliderValueDisplay = null;
        this.createSlider();
    }

    // Function to create the elliptical slider
    createSlider() {
        const container = document.getElementById(this.targetDiv);

        const sliderWrapper = document.createElement("div");
        sliderWrapper.className = "ellipse-container test";

        const ellipseSlider = document.createElement("div");
        ellipseSlider.className = "ellipse-slider";
        ellipseSlider.id = this.id;
        ellipseSlider.style.width = `${this.options.radiusX * 2}px`;
        ellipseSlider.style.height = `${this.options.radiusY * 2}px`;
        ellipseSlider.style.border = `${this.options.borderThickness || 4}px solid ${this.options.color || '#333'}`;
        ellipseSlider.style.backgroundColor = this.options.backgroundColor || 'transparent';

        this.sliderHandle = document.createElement("div");
        this.sliderHandle.className = "ellipse-slider-handle";
        this.sliderHandle.style.backgroundColor = this.options.handleColor || '#333';
        this.sliderHandle.style.width = `${this.options.handleSize || 20}px`;
        this.sliderHandle.style.height = `${this.options.handleSize || 20}px`;

        this.sliderValueDisplay = document.createElement("div");
        this.sliderValueDisplay.className = "ellipse-slider-value";
        this.sliderValueDisplay.textContent = `Value: ${this.currentValue}`;

        ellipseSlider.appendChild(this.sliderHandle);
        sliderWrapper.appendChild(ellipseSlider);
        if (this.options.showValue) {
            sliderWrapper.appendChild(this.sliderValueDisplay);
        }
        container.appendChild(sliderWrapper);

        // Set initial position of the handle
        this.setHandlePosition(this.currentValue);

        // Attach event listeners
        let isDragging = false;
        this.sliderHandle.addEventListener("mousedown", () => {
            isDragging = true;
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                this.currentValue = this.moveHandle(e);
                if (this.options.onChange) {
                    this.options.onChange(this.currentValue); // Trigger the onChange callback
                }
            }
        });
        this.setHandlePosition(this.currentValue);
    }

    // Function to set handle position based on value (0 to 100)
    setHandlePosition(value) {
        // Calculate the percentage of the value within the specified range
        const percentage = ((value - this.options.min) / (this.options.max - this.options.min)) * 100;
    
        // Calculate the angle in radians based on the percentage of the range
        const angle = Math.PI -(percentage / 100) * 2 * Math.PI;
    
        // Calculate (x, y) on the ellipse at the given angle
        const outerRadiusX = this.options.radiusX + this.options.borderThickness / 2;
        const outerRadiusY = this.options.radiusY + this.options.borderThickness / 2;
    
        // Offset these coordinates by adding the ellipse’s center position within the container
        const { x, y } = this.calculateEllipsePoint(outerRadiusX, outerRadiusY, angle);

        this.sliderHandle.style.left = `${x + this.options.radiusX}px`;
        this.sliderHandle.style.top = `${y + this.options.radiusY}px`;
    
        // If the slider displays the value, update the display
        if (this.options.showValue) {
            this.sliderValueDisplay.textContent = `Value: ${value}`;
        }    
    }
    

    // Function to move the handle based on mouse position
    moveHandle(e) {
        const ellipseSlider = document.getElementById(this.id);
        const rect = ellipseSlider.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const normX = mouseX / this.options.radiusX;
        const normY = mouseY / this.options.radiusY;

        const angle = Math.atan2(normY, normX);
        
        const value = Math.round(((angle + Math.PI) / (2 * Math.PI)) * 100);

        const outerRadiusX = this.options.radiusX + this.options.borderThickness / 2;
        const outerRadiusY = this.options.radiusY + this.options.borderThickness / 2;
        const scaledValue = (value / 100) * (this.options.max - this.options.min) + this.options.min;

        const { x, y } = this.calculateEllipsePoint(outerRadiusX, outerRadiusY, angle);

        this.sliderHandle.style.left = `${x + this.options.radiusX}px`;
        this.sliderHandle.style.top = `${y + this.options.radiusY}px`;
        
        if (this.options.showValue) {
            this.sliderValueDisplay.textContent = `Value: ${scaledValue.toFixed(2)}`;
        }

        return scaledValue;
    }

    // Helper function to calculate a point on the ellipse given an angle
    calculateEllipsePoint(radiusX, radiusY, angle) {
        const x = radiusX * Math.cos(angle);
        const y = radiusY * Math.sin(angle);
        return { x, y };
    }

    // Method to get the current value of the slider
    getSliderValue() {
        return this.currentValue;
    }
}