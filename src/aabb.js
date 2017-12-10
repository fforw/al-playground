class AABB {
    constructor()
    {
        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;
    }

    extend(x, y)
    {
        if (x < this.minX)
        {
            this.minX = x;
        }

        if (y < this.minY)
        {
            this.minY = y;
        }

        if (x > this.maxX)
        {
            this.maxX = x;
        }

        if (y > this.maxY)
        {
            this.maxY = y;
        }
    }

    renderViewBox(padding = 0.3)
    {
        let {minX, minY, maxX, maxY} = this;

        let width = ( maxX - minX);
        let height = (maxY - minY);

        const halfPadding = padding / 2;
        const rest = 1 + padding * 2;

        if (padding > 0)
        {
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            //console.log({minX, minY, width, height});

            width = width * rest + 8;
            height = height * rest + 8;

            minX = centerX - width/2;
            minY = centerY - height/2;

            //console.log("after", {minX, minY, width, height});
        }

        return minX + " " + minY + " " + width + " " + height;
    }
}

export default AABB;
