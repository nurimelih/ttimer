export const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    "worklet";
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

export const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    "worklet";
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", centerX, centerY,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
    ].join(" ");
};

export const createEdgePath = (
    centerX: number,
    centerY: number,
    radius: number,
    angle: number
) => {
    "worklet";
    const point = polarToCartesian(centerX, centerY, radius, angle);
    return [
        "M", centerX, centerY,
        "L", point.x, point.y
    ].join(" ");
};
